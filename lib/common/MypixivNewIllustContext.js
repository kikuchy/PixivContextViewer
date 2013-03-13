pcv = pcv || {};
pcv.contextViewer = pcv.contextViewer || {};
pcv.contextViewer.MypixivNewIllustContext = (function($, _super){
  var EXP_PAGEOF = /p=(\d+)/;
  var EXP_ID = /id=(\d+)/;

  var MAX_PAR_PAGE = 20;
  var TOTALPAGES = 100;

  var trim = function(target, pin){
    var str = target;
    if(str[0] === pin) str = str.substring(1);
    if(str[str.length - 1] === pin) str = str.substring(0, str.length - 1);
    return str;
  };
  var urlTmpl = function(pageNum){
    return "http://www.pixiv.net/mypixiv_new_illust.php?p=" + pageNum;
  };

  var MypixivNewIllustContext = function(url){
    _super.apply(this, [url]);
    this.url = url;
    var params = url.substring(url.indexOf("?") + 1);
    var m = params.match(EXP_PAGEOF);
    this.pageOf = (m)? parseInt(m[1]) : 1;
    this._nextNumOfPage = this.pageOf + 1;
    this._prevNumOfPage = this.pageOf - 1;
    this.hasPrev = this._prevNumOfPage > 0;
    this.hasNext = false;
    this.totalPages = 1;
  };

  MypixivNewIllustContext.prototype = $.extend({}, _super.prototype);

  MypixivNewIllustContext.prototype._parse = function(html){
    $target = $(html);
    var totalCount = parseInt($("div._unit > span.count-badge", $target).text().match(/\d+/))
    this.totalPages = Math.ceil(totalCount / MAX_PAR_PAGE);
    this.hasNext = this._nextNumOfPage <= this.totalPages;
    $articles = $("li.image-item", $target);
    ret = [];
    for(var i = 0, l = $articles.length; i < l; i++){
      var article = $articles.get(i);
      var title = $("h1.title", article).text();
      var $artist = $("a.user", article);
      var artist = $artist.text();
      var descriptionUrl = $("a.work", article).attr("href");
      var thumbnailUrl = $("img._thumbnail", article).attr("src");
      var artistUrl = $artist.attr("href");
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

  MypixivNewIllustContext.prototype._makeParamsAsync = function(url){
    var self = this;
    return $.ajax({url: url}).done(function(html){
      self.pages = self._parse(html);
      self.hadBeenParsed = true;
    });
  };

  MypixivNewIllustContext.prototype._getParamAsync = function(param){
    var dfd = $.Deferred();
    if(this.hadBeenParsed) return this[param];
    var self = this;
    $.when(this._makeParamsAsync(this.url)).done(function(pages){
      dfd.resolve(self[param]);
    });
    return dfd.promise();
  };

  MypixivNewIllustContext.prototype.getPagesAsync = function(){
    return this._getParamAsync("pages");
  };

  MypixivNewIllustContext.prototype.getTotalPagesAsync = function(){
    return this._getParamAsync("totalPages");
  };

  MypixivNewIllustContext.prototype.getHasNextAsync = function(){
    return this._getParamAsync("hasNext");
  };

  MypixivNewIllustContext.prototype.getHasPrevAsync = function(){
    return this._getParamAsync("hasPrev");
  };

  MypixivNewIllustContext.prototype.getNextAsync = function(){
    var dfd = $.Deferred();
    var self = this;
    $.when(this.getHasNextAsync()).done(function(has){
      if(!has) dfd.resolve(null);
      var ret = new MypixivNewIllustContext(urlTmpl(self._nextNumOfPage, self.query));
      dfd.resolve(ret);
    });
    return dfd.promise();
  };

  MypixivNewIllustContext.prototype.getPrevAsync = function(){
    var dfd = $.Deferred();
    var self = this;
    $.when(this.getHasPrevAsync()).done(function(has){
      if(!has) dfd.resolve(null);
      var ret = new MypixivNewIllustContext(urlTmpl(self._prevNumOfPage, self.query));
      dfd.resolve(ret);
    });
    return dfd.promise();
  };

  return MypixivNewIllustContext;
})(jQuery, pcv.contextViewer.ContextBase);
