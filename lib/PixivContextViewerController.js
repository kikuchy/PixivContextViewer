var PixivContextViewerController = (function($){
  var EXP_ILLUST_RANKING = /^http:\/\/www\.pixiv\.net\/ranking\.php/;
  var EXP_ILLUST_SEARCH = /^http:\/\/www\.pixiv\.net\/(search\.php|bookmark_new_illust\.php|new_illust\.php|mypixiv_new_illust\.php)/;
  var PixivContextViewerController = function(){
    this.view = null;
    this.context = null;
    this.referrer= document.referrer;
    var self = this;
      console.log(self);
    chrome.extension.onMessage.addListener(function(message, sender, sendResponse){
      console.log(self);
      var match = message.match(/^request::(.+)/);
      if(match){
        var ret = self["_" + match[1]]();
	sendResponse(ret);
      }
      else{
        sendResponse({type: "bad request: '" + message  + "'", })
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

  PixivContextViewerController.prototype._shouldBeShow = function(){
    this.context = this._checkContext(this.referrer);
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
