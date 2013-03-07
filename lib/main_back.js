$("body").append('<script id="window-template"  type="text/x-handlebars-template"></script>');
$.ajax({url: "template/viewer.html.mustache"}).done(function(html){
  $("#window-template").append(html);
});
pcv = {};
pcv.controller = new PixivContextViewerController();
