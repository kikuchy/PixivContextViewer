var PixivContextViewerView = (function(){
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
    var self = this;
    /*$.ajax({url: chrome.extension.getURL("template/viewer.html.mustache")}).done(function(html){
      self.initDom(html);
    });*/
    chrome.extension.sendMessage(req("fetchWindowTemplate"), function(response){
      var html = chSuc(response);
      self.initDom(html);
    });
  };

  PixivContextViewerView.prototype.initDom = function(html){
    var template = Handlebars.compile(html);
    this.$pcvWindow = $(template(""));
    var self = this;
    chrome.extension.sendMessage(req("fetchPageTemplate"), function(resopnse){
      self.initPageTemplate(response);
    });
  };

  PixivContextViewerView.prototype.initPageTemplate = function(html){
    this.pageTemplate = Handlebars.compile(html);
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
    $("#pcv-list", this.$pcvWindow).append(lis);
  };
  return PixivContextViewerView;
})();
