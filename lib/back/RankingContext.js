pcv = pcv || {};
pcv.contextViewer = pcv.contextViewer || {};
pcv.contextViewer.RankingContext = (function($){
  var EXP_PAGEOF = /p=(\d+)/;
  var EXP_ID = /id=(\d+)/;

  var RankingContext = function(url){
    this.url = url;
    var m = url.match(EXP_PAGEOF);
    this.pageOf = (m)? parseInt(m[1]) : 1;
    this.pages = [];
    this.hadBeenParsed = false;
    this.hasNext = false;
    this._nextNumOfPage = this.pageOf + 1;
    this._prevNumOfPage = this.pageOf - 1;
    this.hasPrev = this._prevNumOfPage > 0;
    this.totalPages = 1;
  };

  RankingContext.prototype._parse = function(html){
    var $target = $(html);
    this.totalPages = $("#page-ranking .ui-modal-trigger.current:first ~ ul li", $target).size();
    this.hasNext = this._nextNumOfPage <= this.totalPages;
    var $articles = $("article", $target);
    var ret = [];
    for(var i = 0, l = $articles.length; i < l; i++){
      var article = $articles.get(i);
      var title = $(".data h2 a", article).text();
      var $artist = $(".data a.user-container", article);
      var artist = $artist.text();
      var descriptionUrl = $("a.image-thumbnail", article).attr("href");
      var thumbnailUrl = $("a.image-thumbnail img.ui-scroll-view", article).data("src");
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

  RankingContext.prototype._makeParams = function(url){
    var dfd = $.Deferred();
    var self = this;
    $.ajax({url: url}).done(function(html){
      self.pages = self._parse(html);
      self.hadBeenParsed = true;
      dfd.resolve(self.pages);
    });
    return dfd.promise();
  };

  RankingContext.prototype.getPages = function(){
    var dfd = $.Deferred();
    if(this.hadBeenParsed) return this.pages;
    var self = this;
    $.when(this._makeParams(this.url)).done(function(pages){
      dfd.resolve(pages);
    });
    return dfd.promise();
  };

  RankingContext.prototype.getTotalPages = function(){
    var dfd = $.Deferred();
    if(this.hadBeenParsed) return this.pages;
    var self = this;
    $.when(this._makeParams(this.url)).done(function(pages){
      dfd.resolve(self.totalPages);
    });
    return dfd.promise();
  };

  RankingContext.prototype.getHasNext = function(){
    var dfd = $.Deferred();
    if(this.hadBeenParsed) return this.pages;
    var self = this;
    $.when(this._makeParams(this.url)).done(function(pages){
      dfd.resolve(self.hasNext);
    });
    return dfd.promise();
  };

  RankingContext.prototype.getHasPrev = function(){
    var dfd = $.Deferred();
    if(this.hadBeenParsed) return this.pages;
    var self = this;
    $.when(this._makeParams(this.url)).done(function(pages){
      dfd.resolve(self.hasPrev);
    });
    return dfd.promise();
  };

  return RankingContext;
})(jQuery);
