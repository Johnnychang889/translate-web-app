function showEntries(entries){
  var $list = $("#booklist");
  $list.empty();
  entries.forEach((entry)=>{
      var $panel = $("<div>").addClass("card");
      var $heading=$("<div>").addClass("card-header");

      var $number=$("<span>").addClass("invisible");
      $number.text(entry.number);
      $heading.append($number)

      var $result=$("<b>").addClass("float-start");
      $result.text("翻譯結果");
      $heading.append($result)

      var $editBtn=$("<a class='btn btn-xs btn-warning float-end editbtn'>").text("Edit");
      var $deleteBtn=$("<a class='btn btn-xs btn-danger float-end delbtn'>").text("Delete");
      $heading.append($deleteBtn).append($editBtn);

      $panel.append($heading);

      var $beforeLangBtn=$("<a class='btn btn-xs btn-success' style='margin-right:10px'>");
      $beforeLangBtn.text(entry.beforeLang);
      var $afterLangBtn=$("<a class='btn btn-xs btn-primary' style='margin-left:10px'>");
      $afterLangBtn.text(entry.afterLang);

      var $post=$("<div>");
      $post.addClass("card-body");

      var $showbefore=$("<span>")
      $showbefore.text(entry.before+" ➜ ");

      var $showafter=$("<span>")
      $showafter.text(entry.after);

      $post.append($beforeLangBtn).append($showbefore).append($showafter).append($afterLangBtn);
      $panel.append($post);
      $list.append($panel);
    })
  }
  function reload(){
    $.ajax({
        type: 'GET',
        url:  '/api/guestbook',
        error: function() {
        },
        success: function(data) {
          if(data.success) console.log(data.entries);
          if(data.success) {
            showEntries(data.entries);
            attachEvent();
          }
        } 
      });
  }

  function attachEvent(){
    $(document).on('click', '.delbtn', function(event){
      $.ajax({
        type: 'DELETE',
        data: {
          title:$(this).parent().contents().get(0).innerHTML
        },
        url:  '/api/guestbook',
        error: function() {

        },
        success: function(data) {
          if(data.success==true){
              //alert("Deleted!");
              reload();
          }
        } 
      });//ajax
    });  
    $(document).on('click', '.editbtn', function(event){
        var title=$(this).parent().contents().get(0).innerHTML; 
        location="/v2/edit-entry/"+title;
    });
  }

  $(function() {
    var $list = $("#booklist");
    reload();
  });