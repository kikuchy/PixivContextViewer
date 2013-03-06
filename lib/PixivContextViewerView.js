var PixivContextViewerView = (function(){
  var PixivContextViewerView = function(){
    this.$pcvWindow = null;
  };
  PixivContextViewerView.prototype._initDomHandler = function(request, sender, sendResponse){
    var template = Handlebars.compile(request);
    this.$pcvWindow = $(template(""));
    sendResponse("request::initialData");
  };
  return PixivContextViewerView;
})();
