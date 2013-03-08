var PixivContextViewerView = (function(){
  var PAGE_WIDTH = 150 + 15 * 2;
  var EXP_ID = /id=(\d+)/;

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
    this.$pcvWindow.on("click", "a.pcv-work", function(){
      self.prepareSaveContext(this.dataset.context);
    });
    chrome.extension.sendMessage(req("getInitialPages"), function(response){
      var pc = chSuc(response);
      self.showInitialList(pc);
    });
  };
  
  PixivContextViewerView.prototype.showInitialList = function(context){
    var contentWidth = context.pages.length * PAGE_WIDTH;
    $("#pcv-contents").css("width", contentWidth + "px");
    var id = parseInt(document.location.href.match(EXP_ID)[1])
    for(var i = 0, l = context.pages.length, $li; i < l; i++){
      $li = $(this.pageTemplate(context.pages[i]));
      if(context.pages[i].id === id) $li.addClass("here");
      $("#pcv-list", this.$pcvWindow).append($li);
    }
  };

  PixivContextViewerView.prototype.prepareSaveContext = function(context){
    var self = this;
    chrome.extension.sendMessage(req("saveContext", context), function(response){
      var rlt = chSuc(response);
    });
  };
  return PixivContextViewerView;
})();
