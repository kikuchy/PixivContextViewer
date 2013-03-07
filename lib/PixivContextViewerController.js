var PixivContextViewerController = (function($){
  var EXP_ILLUST_RANKING = /^http:\/\/www\.pixiv\.net\/ranking\.php/;
  var EXP_ILLUST_SEARCH = /^http:\/\/www\.pixiv\.net\/(search\.php|bookmark_new_illust\.php|new_illust\.php|mypixiv_new_illust\.php)/;
  var PixivContextViewerController = function(){
    this.view = null;
    this.context = null;
    this.referrer= null;
    var self = this;
    chrome.extension.onMessage.addListener(function(message, sender, sendResponse){
      if(PixivContextViewerController.prototype.hasOwnProperty("_" + message.request)){
        var ret = self["_" + message.request].apply(self, message.arguments);
	sendResponse({
	  success: true,
	  response: message.request,
	  result: ret
	});
      }else{
        sendResponse({
	  success: false,
	  response: message.request,
	  result: "undefined method was called"
	});
      }
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

  PixivContextViewerController.prototype._shouldBeShow = function(referrer){
    this.context = this._checkContext(referrer);
    if(this.context) this.referrer = referrer;
    return !!this.context;
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
	numOfPage: self.context.pageOf
      };
      dfd.resolve(ret);
    });
    return dfd.promise();
  };
  return PixivContextViewerController;
})(jQuery);
