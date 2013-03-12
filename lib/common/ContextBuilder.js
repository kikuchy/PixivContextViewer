pcv = pcv || {};
pcv.contextViewer = pcv.contextViewer || {};
pcv.contextViewer.ContextBuilder = (function(){
  var contextUrls = {
    "RankingContext": /^http:\/\/www\.pixiv\.net\/ranking\.php/,
    "SearchContext": /^http:\/\/www\.pixiv\.net\/(search\.php|bookmark_new_illust\.php|new_illust\.php|mypixiv_new_illust\.php)/
  };
  var builder = function(url){
    for(var type in contextUrls){
      if(url.match(contextUrls[type])){
        return new pcv.contextViewer[type](url);
      }
    }
  };
  return builder;
})();
