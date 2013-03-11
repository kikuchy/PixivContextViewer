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
      if(BackController.prototype.hasOwnProperty(message.request)){
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
    var nowpage = location.match(EXP_ILLUST_DETAIL);
    var ctx = this._checkContext(referrer || "");
    if(!!nowpage && !!ctx){
	    this._createContext(this.tabId, referrer);
	    return true;
    }else{
      var refch = referrer.match(EXP_ILLUST_DETAIL);
      if(!!nowpage && !!refch){
        var savedCtx = this._searchContextHistory(this.tabId, referrer);
	if(savedCtx){
	  this._createContext(referrer)
	  return true;
	}else{
	 this._clearContextHistory(this.tabId);
	 this._destroyContext(this.tabId);
	 return false;
	}
      }else{
	this._clearContextHistory(this.tabId);
        this._destroyContext(this.tabId);
	 return false;
      }
    }

    // TODO: 「戻る」ボタンを使うとコンテキストが維持できない問題を修正する
    /*var nowpage = location.match(EXP_ILLUST_DETAIL);
    referrer = (this._restoreContext(this.tabId) || referrer) || "";
    this.context = this._checkContext(referrer);
    if(this.context) this.referrer = referrer;
    return !!this.context && !!nowpage;*/
  };

  BackController.prototype.getInitialContextAsync = function(numOfPage){
    var dfd = $.Deferred();
    var ctx = this._checkContext(this._restoreContext(this.tabId) || "");
    if(!ctx) return dfd.reject();
    var self = this;
    $.when(ctx.getPages(), ctx.getHasPrev(), ctx.getHasNext()).done(function(pages, hasPrev, hasNext){
      var ret = {
        pages: pages,
	hasPrev: hasPrev,
	hasNext: hasNext,
	numOfPage: ctx.pageOf,
	url: ctx.url
      };
      dfd.resolve(ret);
    });
    return dfd.promise();
  };

  BackController.prototype.pushContextHistory = function(pageUrl, ctxUrl){
    this._createContextHistory(this.tabId, pageUrl, ctxUrl);
  };

  BackController.prototype._createContext = function(tabId, ctxUrl){
    pcv.contextViewer.localTabContextStorage(tabId, ctxUrl);
  };

  BackController.prototype._createContextHistory = function(tabId, pageUrl, ctxUrl){
    pcv.contextViewer.localContextHistoryStorage("" + tabId + pageUrl, ctxUrl);
  };

  BackController.prototype._restoreContext = function(tabId){
    var ret = pcv.contextViewer.localTabContextStorage(tabId);
    return ret;
  };

  BackController.prototype._destroyContext = function(tabId){
    pcv.contextViewer.localTabContextStorage(tabId, null);
  };

  BackController.prototype._searchContextHistory = function(tabId, pageUrl){
    return pcv.contextViewer.localContextHistoryStorage("" + tabId + pageUrl);
  };

  BackController.prototype._clearContextHistory = function(tabId){
    pcv.contextViewer.localContextHistoryStorage.each(function(key, value){
      if(key.match(new RegExp("^" + tabId))){
        this(key, null);
      }
    });
  };

  return BackController;
})();
