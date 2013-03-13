pcv = pcv || {};
pcv.contextViewer = pcv.contextViewer || {};
pcv.contextViewer.MyIllustContext = (function($, _super){
  var EXP_PAGEOF = /p=(\d+)/;
  var EXP_ID = /id=(\d+)/;

  var MAX_PAR_PAGE = 20;

  var trim = function(target, pin){
    var str = target;
    if(str[0] === pin) str = str.substring(1);
    if(str[str.length - 1] === pin) str = str.substring(0, str.length - 1);
    return str;
  };
  var urlTmpl = function(pageNum){
    return "http://www.pixiv.net/member_illust.php?" + "p=" + pageNum;
  };

  var MyIllustContext = function(url){
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

  MyIllustContext.prototype = $.extend({}, _super.prototype);

  MyIllustContext.prototype._parse = function(html){
    $target = $(html);
    var totalCount = parseInt($("div.column-header > span.count-badge", $target).text().match(/\d+/))
    this.totalPages = Math.ceil(totalCount / MAX_PAR_PAGE);
    this.hasNext = this._nextNumOfPage <= this.totalPages;
    $articles = $("div.display_works > ul > li", $target);
    ret = [];
    for(var i = 0, l = $articles.length; i < l; i++){
      var article = $articles.get(i);
      var title = $("a:first", article).text();
      var artist = "";
      var descriptionUrl = "/" + $("a:first", article).attr("href");
      var thumbnailUrl = $("a:first img", article).attr("src");
      var artistUrl = "";
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

  MyIllustContext.prototype._makeParamsAsync = function(url){
    var self = this;
    return $.ajax({url: url}).done(function(html){
      self.pages = self._parse(html);
      self.hadBeenParsed = true;
    });
  };

  MyIllustContext.prototype._getParamAsync = function(param){
    var dfd = $.Deferred();
    if(this.hadBeenParsed) return this[param];
    var self = this;
    $.when(this._makeParamsAsync(this.url)).done(function(pages){
      dfd.resolve(self[param]);
    });
    return dfd.promise();
  };

  MyIllustContext.prototype.getPagesAsync = function(){
    return this._getParamAsync("pages");
  };

  MyIllustContext.prototype.getTotalPagesAsync = function(){
    return this._getParamAsync("totalPages");
  };

  MyIllustContext.prototype.getHasNextAsync = function(){
    return this._getParamAsync("hasNext");
  };

  MyIllustContext.prototype.getHasPrevAsync = function(){
    return this._getParamAsync("hasPrev");
  };

  MyIllustContext.prototype.getNextAsync = function(){
    var dfd = $.Deferred();
    var self = this;
    $.when(this.getHasNextAsync()).done(function(has){
      if(!has) dfd.resolve(null);
      var ret = new MyIllustContext(urlTmpl(self._nextNumOfPage));
      dfd.resolve(ret);
    });
    return dfd.promise();
  };

  MyIllustContext.prototype.getPrevAsync = function(){
    var dfd = $.Deferred();
    var self = this;
    $.when(this.getHasPrevAsync()).done(function(has){
      if(!has) dfd.resolve(null);
      var ret = new MyIllustContext(urlTmpl(self._prevNumOfPage));
      dfd.resolve(ret);
    });
    return dfd.promise();
  };

  return MyIllustContext;
})(jQuery, pcv.contextViewer.ContextBase);
