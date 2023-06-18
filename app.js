var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
const axios = require("axios");
require('dotenv').config();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydatabase.db');
//delete table
db.run('DROP TABLE IF EXISTS translationRecord');
//add table
db.run("CREATE TABLE IF NOT EXISTS translationRecord(id INTEGER PRIMARY KEY, number INT, beforeLang TEXT, before TEXT, afterLang TEXT, after TEXT)");
//when db is updated, print table translationRecord
db.on('update', (err) => {
  if (err) {
    throw err;
  } else {
    db.all('SELECT * FROM translationRecord', [], (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        console.log(row);
      });
    });
  }
});

var app = express();

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.resolve(__dirname, "public")));

var number = 2;
var entries = [{number: "1", beforeLang:"en", before:"world", afterLang:"zh-tw", after:"世界"}, 
              {number: "2", beforeLang:"ja", before:"ペン", afterLang:"zh-tw", after:"筆"}];
app.locals.entries = entries;

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(request, response) {
  response.render("index2");
});


app.get("/new-entry", function(request, response) {
  response.render("new-entry");
});

app.post("/new-entry", function(request, response) {
  if (!request.body.before) {
		response.status(400).send("Entries must have a text.");
		return; 
	}
  var beforeLang = request.body.beforeLang;
  var before = request.body.before;
  var afterLang = request.body.afterLang;
  var after;

  const encodedParams = new URLSearchParams();
  encodedParams.append("q", request.body.before);
  encodedParams.append("target", request.body.afterLang);
  encodedParams.append("source", request.body.beforeLang);

  const options = {
    method: 'POST',
    url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'application/gzip',
      'X-RapidAPI-Key': process.env.API_KEY,
      'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
    },
    data: encodedParams
  };

  axios.request(options).then(async function (res) {
    after = await res.data.data.translations[0].translatedText;
  }).then(function (res) {
    number++;
    entries.push({
      number: number.toString(),
      beforeLang: beforeLang,
      before: before,
      afterLang: afterLang,
      after: after
    });
    db.run('INSERT INTO translationRecord (number, beforeLang, before, afterLang, after) VALUES (?, ?, ?, ?, ?)', [number.toString(), beforeLang, before, afterLang, after]);
    db.all('SELECT * FROM translationRecord', [], (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        console.log(row);
      });
    });
    
    response.redirect("/v2");
  }).catch(function (error) {
    console.error(error);
  });

});

var api = require('./apiroutes'); 
app.use('/api', api);

var v2 = require('./v2routes'); 
app.use('/v2', v2);

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
    process.exit();
  });
});

app.use(function(request, response) {
  response.status(404).render("404");
});
   
http.createServer(app).listen(3000, function() {
  console.log("Translator app started on port 3000.");
});
