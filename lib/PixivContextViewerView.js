var PixivContextViewerView = (function(){
  var PixivContextViewerView = function(){
    this.$pcvWindow = null;
    this.pageTemplate = null;
    var self = this;
    chrome.extension.sendMessage("request::shouldBeShow", function(response){
      if(response) self.initialize();
      console.log(self);
    });
  };

  PixivContextViewerView.prototype.initialize = function(){
    var self = this;
    chrome.extension.sendMessage("request::fetchWindowTemplate", function(response){
      self.initDom(response);
    });
  };

  PixivContextViewerView.prototype.initDom = function(html){
    var template = Handlebars.compile(html);
    this.$pcvWindow = $(template(""));
    var self = this;
    chrome.extension.sendMessage("request::fetchPageTemplate", function(resopnse){
      self.initPageTemplate(response);
    });
  };

  PixivContextViewerView.prototype.initPageTemplate = function(html){
    this.pageTemplate = Handlebars.compile(html);
    var self = this;
    chrome.extension.sendMessage("request::getInitialPages", function(response){
      self.showInitialList(response.pages);
    });
  };

  PixivContextViewerView.prototype.showInitialList = function(pages){
    var lis = "";
    for(var i = 0, l = pages.length; i < l; i++){
      lis += this.pageTemplate(pages[i]);
    }
    $("#pcv-list", this.$pcvWindow).append(lis);
  };
  return PixivContextViewerView;
})();
