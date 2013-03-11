pcv = pcv || [];
pcv.contextViewer = pcv.contextViewer || {};
pcv.contextViewer.BackController = (function(){
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

  var BackController = function(){
    this.tabId = -1;
    this.context = null;
    var self = this;
    chrome.extension.onMessage.addListener(function(message, sender, sendResponse){
      self.tabId = sender.tab.id;
      if(PixivContextViewerController.prototype.hasOwnProperty(message.request)){
        var ret = self[message.request].apply(self, message.arguments);
	$.when(ret).done(function(res){
	  sendResponse(rsp(true, message.request, res));
	});
      }else{
        sendResponse(rsp(false, message.request, "undefined method was called"));
      }
      return true;
    });
  };

  BackController.prototype._checkContext = function(ref){
    if(ref.match(EXP_ILLUST_RANKING)){
      return new pcv.contextViewer.RankingContext(ref);
    }else if(ref.match(EXP_ILLUST_SEARCH)){
      return new pcv.contextViewer.SearchContext(ref);
    }
    return null;
  };

  BackController.prototype.shouldBeShow = function(referrer, location){
    // TODO: 「戻る」ボタンを使うとコンテキストが維持できない問題を修正する
    var nowpage = location.match(EXP_ILLUST_DETAIL);
    referrer = (this._restoreContext(this.tabId) || referrer) || "";
    this.context = this._checkContext(referrer);
    if(this.context) this.referrer = referrer;
    return !!this.context && !!nowpage;
  };

  BackController.prototype.getInitialContextAsync = function(numOfPage){
    var dfd = $.Deferred();
    if(!this.context) return dfd.reject();
    var self = this;
    $.when(this.context.getPages(), this.context.getHasPrev(), this.context.getHasNext()).done(function(pages, hasPrev, hasNext){
      var ret = {
        pages: pages,
	hasPrev: hasPrev,
	hasNext: hasNext,
	numOfPage: self.context.pageOf,
	url: self.context.url
      };
      dfd.resolve(ret);
    });
    return dfd.promise();
  };

  BackController.prototype.saveContext = function(url){
    pcv.localTabStorage(this.tabId, url);
  };

  BackController.prototype.restoreContext = function(tabId){
    var ret = pcv.localTabStorage(tabId);
    pcv.localTabStorage(tabId, null);
    return ret;
  };

  return BackController;
})();
