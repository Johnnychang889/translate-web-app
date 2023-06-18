var express = require("express");
var v2=express.Router();

v2.get("/", function(request, response) {
  response.render("index2");
});

v2.get("/edit-entry/:title", function(req, res) {
    var entryIndex=-1;
    var entries=req.app.locals.entries;
    for(var i=0;i<entries.length;i++){
        if(entries[i].number==req.params.title){
          entryIndex=i;
        }
    }
    if(entryIndex!=-1)
      res.render("edit-entry", 
                { 
                  number:req.params.title,
                  text: entries[entryIndex].before,
                  language: entries[entryIndex].beforeLang,
                  target: entries[entryIndex].afterLang
                });
    else 
      res.status(404).render("404");
  });

module.exports = v2;