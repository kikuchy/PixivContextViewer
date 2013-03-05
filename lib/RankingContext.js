var RankingContext = (function($){
  var EXP_PAGEOF = /ranking\.php\?.*p=(\d+)/;

  var RankingContext = function(url){
    this.url = url;
    var m = url.match(EXP_PAGEOF);
    this.pageOf = (m)? parseInt(m[1]) : 1;
  };

  RankingContext.prototype._parse = function(html){
    $target = $(html);
    $articles = $("article", $target);
    ret = [];
    for(var i = 0, l = $articles.length; i < l; i++){
      article = $articles.get(i);
      title = $(".data h2 a", article).text();
      $artist = $(".data a.user-container", article);
      artist = $artist.text();
      descriptionUrl = $("a.image-thumbnail", article).attr("href");
      thumbnailUrl = $("a.image-thumbnail img.ui-scroll-view", article).data("src");
      artistUrl = $artist.attr("href");
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
