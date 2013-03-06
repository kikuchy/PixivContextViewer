var RankingContext = (function($){
  var EXP_PAGEOF = /ranking\.php\?.*p=(\d+)/;

  var RankingContext = function(url){
    this.url = url;
    var m = url.match(EXP_PAGEOF);
    this.pageOf = (m)? parseInt(m[1]) : 1;
  };

  RankingContext.prototype._parse = function(html){
    var $target = $(html);
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
      ret.push({
        artist: artist,
	artistUrl: artistUrl,
	title: title,
	descriptionUrl: descriptionUrl,
	thumbnailUrl: thumbnailUrl
      });
    }
    return ret;
  };

  return RankingContext;
})(jQuery);
