pcv = pcv || {};
pcv.contextViewer = pcv.contextViewer || {};
pcv.contextViewer.ContextTrapper = (function(){
  var targetPageAndContext = {
  　　	"/mypage.php": [
	  [
	    "section.item section.content ul.image-items li.image-item a.work", function(dom){ return "http://www.pixiv.net" + $(dom).parents("section.content").children("div.more").children("a").attr("href"); }
	  ],
	  [
	    "div#page-mypage div#column-misc section.item ol.ranking li.rank-detail > a[href^='/member_illust.php'], div#page-mypage div#column-misc section.item ol.ranking li.rank-detail h2 a",
	    function(dom){ return "http://www.pixiv.net" + $(dom).parents("section.item").children("div.more").children("a").attr("href"); }
	  ]
	],
	"/member_illust\.php\?.*mode=medium":[
          [
	    "ul.sibling-items li.older a, ul.sibling-items li.newer a", function(){ return "http://www.pixiv.net" + $("ul.sibling-items li.list a").attr("href");  }
	  ]
	],
	"/member\.php\?.*id=": [
	  [
	    "div.worksListOthers ul.image-items li.image-item a", function(dom){ return "http://www.pixiv.net" + $(dom).parents("div.worksListOthers").children("div._more").children("a").attr("href"); }
	  ],
	  [
            "div.worksListOthersImg ul li a:nth-child(1)", function(dom){ return "http://www.pixiv.net/" + $(dom).parents("div.worksListOthers").children("p.worksAlso").children("a").attr("href"); }
	  ]
	],
	"/tags\.php\?.*tag=": [
	  [
	    "div#item-container section.item section.content ul.images li.image > a:nth-child(1)", function(dom){ return "http://www.pixiv.net" + $(dom).parents("section.content").children("a").attr("href"); }
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
	    $(document).on("click", sel, (function(ctxUrl){ var makeCtxUrl = ctxUrl; return function(){ saveContextUrl(makeCtxUrl(this)); }; })(ctxUrl));
	  }else{
	    $(document).on("click", sel, (function(ctxUrl){ var makeCtxUrl = ctxUrl; return function(){ saveContextUrl(makeCtxUrl); }; })(ctxUrl));
	  }
	}
      }
    }
  };
  return trapper;
})();
