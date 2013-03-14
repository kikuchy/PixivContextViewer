pcv = pcv || {};
pcv.contextViewer = pcv.contextViewer || {};
pcv.contextViewer.ContextBuilder = (function(){
  var contextUrls = {
    "RankingContext": /^http:\/\/www\.pixiv\.net\/ranking\.php/,
    "SearchContext": /^http:\/\/www\.pixiv\.net\/search\.php/,
    "BookmarkNewIllustContext": /^http:\/\/www\.pixiv\.net\/bookmark_new_illust\.php/,
    "MypixivNewIllustContext": /^http:\/\/www\.pixiv\.net\/mypixiv_new_illust\.php/,
    "NewIllustContext": /^http:\/\/www\.pixiv\.net\/new_illust\.php/,
    "MemberIllustContext": /^http:\/\/www\.pixiv\.net\/member_illust\.php\?.*id=/,
    "MyIllustContext": /^http:\/\/www\.pixiv\.net\/member_illust\.php(\?p=)?.*$/,	// MemberIllustContextより後に置かないとマッチしちゃうのが困りもの…
    "MemberBookmarkContext": /^http:\/\/www\.pixiv\.net\/bookmark\.php\?.*id=/,
    "MyBookmarkContext": /^http:\/\/www\.pixiv\.net\/bookmark\.php\?/			// MemberBookmarkContextより後に書かないとマッチしてしまう…
  };
  var EXP_ILLUST_DETAIL = /^http:\/\/www\.pixiv\.net\/member_illust\.php\?.*mode=/;

  var builder = function(url){
    // MemberIllustContextとイラスト詳細ページのバッティングを避ける
    if(url.match(EXP_ILLUST_DETAIL)) return;
    for(var type in contextUrls){
      if(url.match(contextUrls[type])){
        return new pcv.contextViewer[type](url);
      }
    }
  };
  return builder;
})();
