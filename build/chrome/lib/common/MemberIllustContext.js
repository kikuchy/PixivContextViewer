pcv = pcv || {};
pcv.contextViewer = pcv.contextViewer || {};
pcv.contextViewer.MemberIllustContext = (function($, _super){
  var EXP_PAGEOF = /p=(\d+)/;
  var EXP_ID = /id=(\d+)/;

  var MAX_PAR_PAGE = 20;

  var trim = function(target, pin){
    var str = target;
    if(str[0] === pin) str = str.substring(1);
    if(str[str.length - 1] === pin) str = str.substring(0, str.length - 1);
    return str;
  };
  var urlTmpl = function(pageNum, memberId){
    return "http://www.pixiv.net/member_illust.php?" + ( (memberId) ? ("id=" + memberId + "&") : "" ) + "p=" + pageNum;
  };

  var MemberIllustContext = function(url){
    _super.apply(this, [url]);
    this.url = url;
    var params = url.substring(url.indexOf("?") + 1);
    var m = params.match(EXP_PAGEOF);
    this.pageOf = (m)? parseInt(m[1]) : 1;
    m = params.match(EXP_ID);
    this.memberId = (m)? parseInt(m[1]) : null;
    this._nextNumOfPage = this.pageOf + 1;
    this._prevNumOfPage = this.pageOf - 1;
    this.hasPrev = this._prevNumOfPage > 0;
    this.hasNext = false;
    this.totalPages = 1;
  };

  MemberIllustContext.prototype = $.extend({}, _super.prototype);

  MemberIllustContext.prototype._parse = function(html){
    $target = $(html);
    var totalCount = parseInt($("div._unit > span.count-badge", $target).text().match(/\d+/))
    this.totalPages = Math.ceil(totalCount / MAX_PAR_PAGE);
    this.hasNext = this._nextNumOfPage <= this.totalPages;
    $articles = $("li.image-item", $target);
    var artist = $("h1.user", $target).text();
    var artistUrl = $("a.user-link", $target).attr("href");
    ret = [];
    for(var i = 0, l = $articles.length; i < l; i++){
      var article = $articles.get(i);
      var title = $("h1.title", article).text();
      var $artist = $("a.user", article);
      var descriptionUrl = $("a.work", article).attr("href");
      var thumbnailUrl = $("img._thumbnail", article).attr("src");
      var id = parseInt(descriptionUrl.match(EXP_ID)[1]);
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

  MemberIllustContext.prototype._makeParamsAsync = function(url){
    var self = this;
    return $.ajax({url: url}).done(function(html){
      self.pages = self._parse(html);
      self.hadBeenParsed = true;
    });
  };

  MemberIllustContext.prototype._getParamAsync = function(param){
    var dfd = $.Deferred();
    if(this.hadBeenParsed) return this[param];
    var self = this;
    $.when(this._makeParamsAsync(this.url)).done(function(pages){
      dfd.resolve(self[param]);
    });
    return dfd.promise();
  };

  MemberIllustContext.prototype.getPagesAsync = function(){
    return this._getParamAsync("pages");
  };

  MemberIllustContext.prototype.getTotalPagesAsync = function(){
    return this._getParamAsync("totalPages");
  };

  MemberIllustContext.prototype.getHasNextAsync = function(){
    return this._getParamAsync("hasNext");
  };

  MemberIllustContext.prototype.getHasPrevAsync = function(){
    return this._getParamAsync("hasPrev");
  };

  MemberIllustContext.prototype.getNextAsync = function(){
    var dfd = $.Deferred();
    var self = this;
    $.when(this.getHasNextAsync()).done(function(has){
      if(!has) dfd.resolve(null);
      var ret = new MemberIllustContext(urlTmpl(self._nextNumOfPage, self.memberId));
      dfd.resolve(ret);
    });
    return dfd.promise();
  };

  MemberIllustContext.prototype.getPrevAsync = function(){
    var dfd = $.Deferred();
    var self = this;
    $.when(this.getHasPrevAsync()).done(function(has){
      if(!has) dfd.resolve(null);
      var ret = new MemberIllustContext(urlTmpl(self._prevNumOfPage, self.memberId));
      dfd.resolve(ret);
    });
    return dfd.promise();
  };

  return MemberIllustContext;
})(jQuery, pcv.contextViewer.ContextBase);
