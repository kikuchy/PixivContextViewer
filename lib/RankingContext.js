var RankingContext = (function($){
  var EXP_PAGEOF = /ranking\.php\?.*p=(\d+)/;

  var RankingContext = function(url){
    this.url = url;
    this.pageOf = parseInt(url.match(EXP_PAGEOF)[1]);
  };
  return RankingContext;
})(jQuery);
