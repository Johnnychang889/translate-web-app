var sorceLang="en";
var targetLang="zh-tw";
$(function() {
  $("#sourceLang a").on("click", function(event) {
    event.preventDefault();
    sorceLang = $(this).text();
    $("#beforeLang").val(sorceLang);
  });
  $("#targetLang a").on("click", function(event) {
    event.preventDefault();
    targetLang = $(this).text();
    $("#afterLang").val(targetLang);
  });

});