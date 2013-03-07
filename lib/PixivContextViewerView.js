var PixivContextViewerView = (function(){
  var PAGE_WIDTH = 150 + 15 * 2;

  var req = function(method, args){
    args = args ? args : [];
    args = (args instanceof Array) ? args : [args];
    return {
      request: method,
      arguments: args
    };
  };

  var chSuc = function(res){
    if(!res.success){
      console.warn(res);
    }
    return res.result;
  };

  var PixivContextViewerView = function(){
    this.$pcvWindow = null;
    this.pageTemplate = null;
    var self = this;
    chrome.extension.sendMessage(req("shouldBeShow", document.referrer), function(response){
      var show = chSuc(response);
      console.debug(self);
      if(show) self.initialize();
    });
  };

  PixivContextViewerView.prototype.initialize = function(){
    this.pageTemplate = Handlebars.compile(page_html_mustache);
    var template = Handlebars.compile(viewer_html_mustache);
    this.$pcvWindow = $(template(""));
    $("body").append(this.$pcvWindow);
    var self = this;
    chrome.extension.sendMessage(req("getInitialPages"), function(response){
      var pc = chSuc(response);
      self.showInitialList(pc.pages);
    });
  };
  
  PixivContextViewerView.prototype.showInitialList = function(pages){
    var lis = "";
    for(var i = 0, l = pages.length; i < l; i++){
      lis += this.pageTemplate(pages[i]);
    }
    var contentWidth = pages.length * PAGE_WIDTH;
    $("#pcv-contents").css("width", contentWidth + "px");
    $("#pcv-list", this.$pcvWindow).append(lis);
  };
  return PixivContextViewerView;
})();
