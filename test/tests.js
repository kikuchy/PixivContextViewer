module("Controller", {
  setup: function(){
    referrer = "http://www.pixiv.net/ranking.php?mode=daily";
  }
});
test("initialize", function(){
  var cont = new PixivContextViewerController();
  ok(cont, "object created");
});
test("check context", function(){
  var cont = new PixivContextViewerController();
  var ctx = cont._checkContext("http://www.pixiv.net/ranking.php?mode=daily");
  ok(ctx instanceof RankingContext, "make RankingContext");
  ctx = cont._checkContext("http://www.pixiv.net/bookmark_new_illust.php");
  ok(ctx instanceof SearchContext, "make SearchContext");
});

asyncTest("fetching window template text", function(){
  $("#sandbox").append('<script id="window-template" type="text/x-handlebars-template" />');
  $("#window-template").load("../template/viewer.html.mustache",{}, function(){
    var cont = new PixivContextViewerController();
    ok(cont._fetchWindowTemplate(), "fetch window template text");
    start();
  });
});

asyncTest("fetching page template text", function(){
  $("#sandbox").append('<script id="page-template" type="text/x-handlebars-template" />');
  $("#page-template").load("../template/page.html.mustache",{}, function(){
    var cont = new PixivContextViewerController();
    ok(cont._fetchPageTemplate(), "fetch page template text");
    start();
  });
});

test("judge view should show window",function(){
  var cont = new PixivContextViewerController();
  ok(cont._shouldBeShow("http://www.pixiv.net/ranking.php?mode=daily"), "when previous page is ranking page");
  ok(cont._shouldBeShow("http://www.pixiv.net/bookmark_new_illust.php"), "when previous page is recent illusts page");
  ok(!cont._shouldBeShow("http://www.pixiv.net/member_illust.php"), "when previous page is member illust page");
});

asyncTest("get pages for initialiing view", function(){
  var rankingurl = "http://www.pixiv.net/ranking.php?mode=rookie&p=2";
  $.mockjax({
    	url: rankingurl,
	proxy: "proxy/ranking.html"
  });
  var cont = new PixivContextViewerController();
  cont._shouldBeShow(rankingurl);
  var dfd = cont._getInitialPages(1);
  $.when(dfd).done(function(returned){
    ok(typeof returned === "object", "retuened object");
    ok(returned.pages.length, "object has Array named 'pages'");
    ok(typeof returned.hasPrev === "boolean", "object has bool named 'hasPrev'");
    ok(typeof returned.hasNext === "boolean", "object has bool named 'hasNext'");
    ok(typeof returned.numOfPage === "number", "object has number named 'numOfPage'");
    start();
  });
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

asyncTest("make pages", function(){
  var rankingurl = "/ranking.php?mode=rookie&p=2"
  var rc = new RankingContext(rankingurl);
  $.mockjax({
    	url: rankingurl,
	proxy: "proxy/ranking.html"
  });
  $.when(rc._makePages(rankingurl)).done(function(pages){
    ok(rc.hadBeenParsed, "already parsed");
    equal(rc.pages.length, 50, "ranking page has 50 pages");
    start();
  });
});

asyncTest("get pages", function(){
  var rankingurl = "/ranking.php?mode=rookie&p=2"
  var rc = new RankingContext(rankingurl);
  $.mockjax({
    	url: rankingurl,
	proxy: "proxy/ranking.html"
  });
  $.when(rc.getPages()).done(function(pages){
    ok(rc.hadBeenParsed, "already parsed");
    equal(rc.pages.length, 50, "ranking page has 50 pages");
    start();
  });
});

module("SearchContext",{
	setup: function(){
	  
	}
});
test("initialize", function(){
  var rankingurl = "http://www.pixiv.net/search.php?s_mode=s_tag&word=%E3%82%8F%E3%81%8B%E3%81%B2%E3%81%BE";
  var rc = new SearchContext(rankingurl);
  ok(rc, "object created");
  ok(rc.url === rankingurl, "url setted");
  ok(rc.pageOf === 1, "if there is no p propaty");
});
asyncTest("parseRankingPage", function(){
  var rankingurl = "/search.php?s_mode=s_tag&word=%E3%82%8F%E3%81%8B%E3%81%B2%E3%81%BE";
  var rc = new SearchContext(rankingurl);
  $.mockjax({
    	url: rankingurl,
	proxy: "proxy/searchresult.html"
  });
  $.ajax({
  	url: rankingurl,
	type: "GET"
  }).done(function(data){
	var pages = rc._parse(data);
	ok(pages.length === 16, "parse count");
	ok(pages[0].title === "わかひま", "page title");
	ok(pages[0].artist === "BIG豆腐", "page artist");
	ok(pages[0].descriptionUrl === "/member_illust.php?mode=medium&illust_id=34010700", "page url");
	ok(pages[0].thumbnailUrl === "http://i1.pixiv.net/img73/img/168cm55kg/34010700_s.jpg", "page thumbnal url");
	ok(pages[0].artistUrl=== "/member_illust.php?id=2914055", "page artist url");
	start();
  });
});
module("View");
test("initialize", function(){
  var view = new PixivContextViewerView();
  ok(view, "object created");
  view._initDomHandler($("#window-template").html(), {}, function(){});
  var $windowDom = view.$pcvWindow;
  equal($windowDom.attr("id"), "pcv-window", "top level dom is generated");
  equal($windowDom.children().attr("id"), "pcv-contents", "content dom is generated");
  /*equal($windowDom.children().children().length, 3, "content dom has 3 children");
  equal($windowDom.children().children(".pcv-loading.left").children().length, 5, "loading parts has 5 children");
  equal($windowDom.children().children(".pcv-loading.right").children().length, 5, "loading parts has 5 children");
  equal($windowDom.children().children(".pcv-list").length, 1, "main list exist");
  */
});
