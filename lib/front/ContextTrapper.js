pcv = pcv || {};
pcv.contextViewer = pcv.contextViewer || {};
pcv.contextViewer.ContextTrapper = (function(){
  var targetPageAndContext = {
  　　	"/mypage.php": [
	  [
	    "section.item section.content ul.image-items li.image-item a.work", function(dom){ return "http://www.pixiv.net" + $(dom).parents("section.content").children("div.more").children("a").attr("href"); }
	  ],
	  [
	    "div#page-mypage div#column-misc section.item ol.ranking li.rank-detail a:first, div#page-mypage div#column-misc section.item ol.ranking li.rank-detail h2 a",
	    function(dom){ return "http://www.pixiv.net" + $(dom).parents("section.item").children("div.more").children("a").attr("href"); }
	  ]
	],
	"/member_illust\.php\?.*mode=medium":[
          [
	    "ul.sibling-items li.older a, ul.sibling-items li.newer a", function(){ return "http://www.pixiv.net" + $("ul.sibling-items li.list a").attr("href");  }
	  ]
	]
  };
  var trapper = function(pageUrl, saveContextUrl){
    for(var key in targetPageAndContext){
      if(pageUrl.match(new RegExp(key))){
        var val = targetPageAndContext[key];
	for(var i = 0, l = val.length; i < l; i++){
	  var sel = val[i][0];
	  var ctxUrl = val[i][1];
	  if(typeof ctxUrl === "function"){
	    $(document).on("click", sel, function(){ saveContextUrl(ctxUrl(this)); });
	  }else{
	    $(sel).on("click", function(){ saveContextUrl(ctxUrl); });
	  }
	}
      }
    }
  };
  return trapper;
})();
