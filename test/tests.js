module("Controller", {
  setup: function(){
    referrer = "http://www.pixiv.net/ranking.php?mode=daily";
  }
});
test("initialize", function(){
  var cont = new PixivContextViewerController();
  ok(cont, "object created");
  ok(cont.context, "controller has context");
  ok(cont.view, "controller has view")
});
test("check context", function(){
  var cont = new PixivContextViewerController();
  var ctx = cont._checkContext("http://www.pixiv.net/ranking.php?mode=daily");
  ok(ctx instanceof RankingContext, "make RankingContext");
  ctx = cont._checkContext("http://www.pixiv.net/bookmark_new_illust.php");
  ok(ctx instanceof SearchContext, "make SearchContext");
});

module("RankingContext",{
	setup: function(){
	  
	}
});
test("initialize", function(){
  var rankingurl = "http://www.pixiv.net/ranking.php?mode=rookie&p=2"
  var rc = new RankingContext(rankingurl);
  ok(rc, "object created");
  ok(rc.url === rankingurl, "url setted");
  ok(rc.pageOf === 2, "pageOf setted");
  rankingurl = "http://www.pixiv.net/ranking.php?mode=daily";
  rc = new RankingContext(rankingurl);
  ok(rc.pageOf === 1, "if there is no p propaty");
});
asyncTest("parseRankingPage", function(){
  var rankingurl = "/ranking.php?mode=rookie&p=2"
  var rc = new RankingContext(rankingurl);
  $.mockjax({
    	url: rankingurl,
	proxy: "proxy/ranking.html"
  });
  $.ajax({
  	url: rankingurl,
	type: "GET"
  }).done(function(data){
	var pages = rc._parse(data);
	ok(pages.length === 50, "parse count");
	ok(pages[0].title === "ゴンキルクラ「はっぴーばーすでぃレオリオ！」", "page title");
	ok(pages[0].artist === "土竜(もぐら)", "page artist");
	ok(pages[0].descriptionUrl === "member_illust.php?mode=medium&illust_id=33953193&ref=rn-b--thumbnail", "page url");
	ok(pages[0].thumbnailUrl === "http://i1.pixiv.net/img47/img/bean1000/33953193_s.png?ctype=ranking", "page thumbnal url");
	ok(pages[0].artistUrl=== "member.php?id=1618332&ref=rn-b-51-user", "page artist url");
	start();
  });
});
