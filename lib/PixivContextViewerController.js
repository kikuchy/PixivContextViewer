var PixivContextViewerController = (function($){
  var EXP_ILLUST_RANKING = /^http:\/\/www\.pixiv\.net\/ranking\.php/;
  var EXP_ILLUST_SEARCH = /^http:\/\/www\.pixiv\.net\/(search\.php|bookmark_new_illust\.php|new_illust\.php|mypixiv_new_illust\.php)/;
  var PixivContextViewerController = function(){
    this.view = null;
    this.context = null;
    this.ref = document.referrer;
  };

  PixivContextViewerController.prototype._checkContext = function(ref){
    if(ref.match(EXP_ILLUST_RANKING)){
      return new RankingContext(ref);
    }else if(ref.match(EXP_ILLUST_SEARCH)){
      return new SearchContext(ref);
    }
    return null;
  };

  PixivContextViewerController.prototype._fetchWindowTemplate = function(){
    return $("#window-template").html()
  };
  return PixivContextViewerController;
})(jQuery);
