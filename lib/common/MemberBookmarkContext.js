pcv = pcv || {};
pcv.contextViewer = pcv.contextViewer || {};
pcv.contextViewer.MemberBookmarkContext = (function($, _super){
  var EXP_PAGEOF = /p=(\d+)/;
  var EXP_ID = /id=(\d+)/;
  var EXP_ORDER = /order=(date_d|desc)/;

  var MAX_PAR_PAGE = 20;

  var trim = function(target, pin){
    var str = target;
    if(str[0] === pin) str = str.substring(1);
    if(str[str.length - 1] === pin) str = str.substring(0, str.length - 1);
    return str;
  };
  var urlTmpl = function(pageNum, memberId, order){
    return "http://www.pixiv.net/bookmark.php?id=" + memberId + "&order=" + order + "&rest=show&p=" + pageNum;
  };

  var MemberBookmarkContext = function(url){
    _super.apply(this, [url]);
    this.url = url;
    var params = url.substring(url.indexOf("?") + 1);
    var m = params.match(EXP_PAGEOF);
    this.pageOf = (m)? parseInt(m[1]) : 1;
    m = params.match(EXP_ID);
    this.memberId = (m)? parseInt(m[1]) : null;
    m = params.match(EXP_ORDER);
    this.order = (m)? m[1] : "desc";
    this._nextNumOfPage = this.pageOf + 1;
    this._prevNumOfPage = this.pageOf - 1;
    this.hasPrev = this._prevNumOfPage > 0;
    this.hasNext = false;
    this.totalPages = 1;
  };

  MemberBookmarkContext.prototype = $.extend({}, _super.prototype);

  MemberBookmarkContext.prototype._parse = function(html){
    var $ = $ || jQuery;	// 何故か$がundefinedになることがあるので回避策（その場しのぎ）
    $target = $(html);
    var totalCount = parseInt($("div.column-label > span.count-badge", $target).text().match(/\d+/))
    this.totalPages = Math.ceil(totalCount / MAX_PAR_PAGE);
    this.hasNext = this._nextNumOfPage <= this.totalPages;
    $articles = $("div.display_works > ul > li", $target);
    ret = [];
    for(var i = 0, l = $articles.length; i < l; i++){
      var article = $articles.get(i);
      var $
      var title = $("a:first", article).text() || "-----";	// 削除済みイラストがあった場合の対策（おざなり）
      var artist = $("span.bookmark_artist + span", article).text();
      var descriptionUrl = "/" + ($("a:first", article).attr("href") || "");
      var thumbnailUrl = $("img:first", article).attr("src");
      var artistUrl = "/" + $("span.bookmark_artist + span a", article).attr("href");
      var m = descriptionUrl.match(EXP_ID);
      var id = (m)? parseInt(m[1]) : 0;
      ret.push({
        artist: artist,
	artistUrl: artistUrl,
	title: title,
	descriptionUrl: descriptionUrl,
	thumbnailUrl: thumbnailUrl,
	id: id,
	context: this.url
      });
    }
    return ret;
  };

  MemberBookmarkContext.prototype._makeParamsAsync = function(url){
    var self = this;
    return $.ajax({url: url}).done(function(html){
      self.pages = self._parse(html);
      self.hadBeenParsed = true;
    });
  };

  MemberBookmarkContext.prototype._getParamAsync = function(param){
    var dfd = $.Deferred();
    if(this.hadBeenParsed) return this[param];
    var self = this;
    $.when(this._makeParamsAsync(this.url)).done(function(pages){
      dfd.resolve(self[param]);
    });
    return dfd.promise();
  };

  MemberBookmarkContext.prototype.getPagesAsync = function(){
    return this._getParamAsync("pages");
  };

  MemberBookmarkContext.prototype.getTotalPagesAsync = function(){
    return this._getParamAsync("totalPages");
  };

  MemberBookmarkContext.prototype.getHasNextAsync = function(){
    return this._getParamAsync("hasNext");
  };

  MemberBookmarkContext.prototype.getHasPrevAsync = function(){
    return this._getParamAsync("hasPrev");
  };

  MemberBookmarkContext.prototype.getNextAsync = function(){
    var dfd = $.Deferred();
    var self = this;
    $.when(this.getHasNextAsync()).done(function(has){
      if(!has) dfd.resolve(null);
      var ret = new MemberBookmarkContext(urlTmpl(self._nextNumOfPage, self.memberId, self.order));
      dfd.resolve(ret);
    });
    return dfd.promise();
  };

  MemberBookmarkContext.prototype.getPrevAsync = function(){
    var dfd = $.Deferred();
    var self = this;
    $.when(this.getHasPrevAsync()).done(function(has){
      if(!has) dfd.resolve(null);
      var ret = new MemberBookmarkContext(urlTmpl(self._prevNumOfPage, self.memberId, self.order));
      dfd.resolve(ret);
    });
    return dfd.promise();
  };

  return MemberBookmarkContext;
})(jQuery, pcv.contextViewer.ContextBase);
