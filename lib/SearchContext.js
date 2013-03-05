var SearchContext = (function($){
  var EXP_PAGEOF = /(search\.php|bookmark_new_illust\.php|new_illust\.php|mypixiv_new_illust\.php)?.*p=(\d+)/

  var SearchContext = function(url){
    this.url = url;
    var m = url.match(EXP_PAGEOF);
    this.pageOf = (m)? parseInt(m[1]) : 1;
  };

  SearchContext.prototype._parse = function(html){
    $target = $(html);
    $articles = $("li.image-item", $target);
    ret = [];
    for(var i = 0, l = $articles.length; i < l; i++){
      article = $articles.get(i);
      title = $("h1.title", article).text();
      $artist = $("a.user", article);
      artist = $artist.text();
      descriptionUrl = $("a.work", article).attr("href");
      thumbnailUrl = $("img._thumbnail", article).attr("src");
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

  return SearchContext;
})(jQuery);
