$(function() {
    $("form").on("submit", function(event) {
      event.preventDefault();

      $.ajax({
        type: 'PUT',
        data: {
            number:$("#number").val(),
            text:$("#text").val(),
            beforeLang:$("#language").val(),
            afterLang:$("#target").val()
        },
        url:  '/api/guestbook',
        error: function() {
        },
        success: function(data) {
          if(data.success==true){
            location="/v2";
          }
        } 
      });//ajax
    });
  });