const axios = require("axios");
exports.list_all_entries = function(req, res) {
  var obj={
    entries:[],
  }
  var entries=req.app.locals.entries;
  for(var i=0;i<entries.length;i++){
      obj.entries.push(entries[i]);
  }
  obj.success=true;
  res.json(obj);
};

exports.create_an_entry = function(req, res) {
  var new_entry = req.body;
  new_entry.published=new Date(); 
  req.app.locals.entries.push(new_entry);
  console.log( 'Create new entry');

  res.json({
    success:true,
    title: req.body.title,
  })
};

exports.update_an_entry = function(req, res) {
  var update_entry = req.body;
  var entries=req.app.locals.entries;
  var entryIndex=-1;
  for(var i=0;i<entries.length;i++){
      if(entries[i].number==update_entry.number){
        entryIndex=i;
      }
  }
  if(entryIndex!=-1){
      const encodedParams = new URLSearchParams();
      encodedParams.append("q", update_entry.text);
      encodedParams.append("target", update_entry.afterLang);
      encodedParams.append("source", update_entry.beforeLang);
    
      const options = {
        method: 'POST',
        url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept-Encoding': 'application/gzip',
          'X-RapidAPI-Key': '0df5de2e2cmshb3092ac88e5b5e2p1d2a07jsn9b6b49377c06',
          'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
        },
        data: encodedParams
      };

      axios.request(options).then(function (response) {
        let result = response.data.data.translations[0].translatedText;
        entries[entryIndex].before=update_entry.text;
        entries[entryIndex].after=result;
        
        return res.json({
          success: true,
          number: update_entry.number,
          text: update_entry.text,
        });
      }).catch(function (error) {
        console.error(error);
      });
      
  }
  else
    res.json({
        success:false,
        message:"not found",
    })
};

exports.delete_an_entry = function(req, res) {
  var idx=-1;
  var entries=req.app.locals.entries;
  for(var i=0;i<entries.length;i++){
    if(entries[i].number==req.body.title){
      idx=i;
    }
  }
  if(idx!=-1){
    entries.splice(idx, 1);
    return res.json({
        success:true,
        deleted_title: req.body.title,
      });  
  }
  else
  res.json({
      success:false,
      message:"not found",
  })
};