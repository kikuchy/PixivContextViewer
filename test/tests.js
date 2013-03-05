module("Controller");
test("initialize", function(){
  var cont = new PixivContextViewerController();
  ok(cont, "object created");
});

module("PageCollection and Extended Classes");
test("initialize", function(){
  var rankingurl = "http://www.pixiv.net/ranking.php?mode=rookie&p=2"
  var rc = new RankingContext(rankingurl);
  ok(rc, "object created");
  ok(rc.url === rankingurl, "url setted");
  ok(rc.pageOf === 2, "pageOf setted");
});
