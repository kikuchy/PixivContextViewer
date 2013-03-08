var PixivContextViewerController = (function($){
  var rsp = function(success, response, result){
    var ret = {
	    success: true,
	    response: response,
	    result: result
	  };
    console.debug(ret);
    return ret;
  };

  var EXP_ILLUST_RANKING = /^http:\/\/www\.pixiv\.net\/ranking\.php/;
  var EXP_ILLUST_SEARCH = /^http:\/\/www\.pixiv\.net\/(search\.php|bookmark_new_illust\.php|new_illust\.php|mypixiv_new_illust\.php)/;
  var EXP_ILLUST_DETAIL = /^http:\/\/www\.pixiv\.net\/member_illust\.php\?.*mode=medium/;
  var PixivContextViewerController = function(){
    this.view = null;
    this.context = null;
    this.referrer= null;
    this.tabId = -1;
    var self = this;
    chrome.extension.onMessage.addListener(function(message, sender, sendResponse){
      self.tabId = sender.tab.id;
      if(PixivContextViewerController.prototype.hasOwnProperty("_" + message.request)){
        var ret = self["_" + message.request].apply(self, message.arguments);
	$.when(ret).done(function(res){
	  sendResponse(rsp(true, message.request, res));
	});
      }else{
        sendResponse(rsp(false, message.request, "undefined method was called"));
      }
      return true;
    });
  };

  PixivContextViewerController.prototype._checkContext = function(ref){
    if(ref.match(EXP_ILLUST_RANKING)){
      return new RankingContext(ref);
    }else if(ref.match(EXP_ILLUST_SEARCH)){
      return new SearchContext(ref);
    }
    return null;
  };

  PixivContextViewerController.prototype._fetchWindowTemplate = function(){
    return $("#window-template").html()
  };

  PixivContextViewerController.prototype._fetchPageTemplate = function(){
    return $("#page-template").html()
  };

  PixivContextViewerController.prototype._shouldBeShow = function(referrer, location){
    var nowpage = location.match(EXP_ILLUST_DETAIL);
    referrer = (this._restoreContext(this.tabId) || referrer) || "";
    this.context = this._checkContext(referrer);
    if(this.context) this.referrer = referrer;
    return !!this.context && !!nowpage;
  };

  PixivContextViewerController.prototype._getInitialPages = function(numOfPage){
    var dfd = $.Deferred();
    if(!this.context) return dfd.reject();
    var self = this;
    $.when(this.context.getPages()).done(function(pages){
      var ret = {
        pages: pages,
	hasPrev: false,
	hasNext: false,
	numOfPage: self.context.pageOf,
	url: self.context.url
      };
      dfd.resolve(ret);
    });
    return dfd.promise();
  };
  PixivContextViewerController.prototype._saveContext = function(url){
    pcv.localTabStorage(this.tabId, url);
  };
  PixivContextViewerController.prototype._restoreContext = function(tabId){
    var ret = pcv.localTabStorage(tabId);
    pcv.localTabStorage(tabId, null);
    return ret;
  };
  return PixivContextViewerController;
})(jQuery);
