module("Controller");
test("initialize", function(){
  var cont = new PixivContextViewerController();
  ok(cont, "object created");
});

module("PageCollection and Extended Classes",{
	setup: function(){
	  
	}
});
test("initialize", function(){
  var rankingurl = "http://www.pixiv.net/ranking.php?mode=rookie&p=2"
  var rc = new RankingContext(rankingurl);
  ok(rc, "object created");
  ok(rc.url === rankingurl, "url setted");
  ok(rc.pageOf === 2, "pageOf setted");
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
