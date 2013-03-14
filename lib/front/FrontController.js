pcv = pcv || {};
pcv.contextViewer = pcv.contextViewer || {};
pcv.contextViewer.FrontController = (function(){
  var req = function(method, args){
    args = args ? args : [];
    args = (args instanceof Array) ? args : [args];
    var ret = {
      request: method,
      arguments: args
    };
    console.debug(ret);
    return ret;
  };

  var chSuc = function(res){
    if(!res.success){
      console.warn(res);
      throw "method:'" + res.response + "' was not successed.";
    }
    return res.result;
  };

  var Uc = function(str){
    return str[0].toUpperCase() + str.substring(1);
  };

  var EXP_ILLUST_DETAIL = /^http:\/\/www\.pixiv\.net\/member_illust\.php\?.*mode=medium/;

  var FrontController = function(){
    this.headContext = null;
    this.tailContext = null;
    var self = this;
    this.view = null;
    if(this.checkExecute()){
      this.view = new pcv.contextViewer.View(this);
	$.when(this.tailContext.getPagesAsync()).done(function(pages){
	  self.view.initializeView(self.tailContext);
	});
    }
    pcv.contextViewer.ContextTrapper(document.location.href, this.saveContextUrl);
  };

   FrontController.prototype.checkExecute = function(){
     var nowpage = document.location.href;
     var referrer = document.referrer;
     var recentContextUrl = pcv.contextViewer.sessionContextStorage("recentContextUrl");
     var mtcNow = nowpage.match(EXP_ILLUST_DETAIL);
     var rfrCtx = pcv.contextViewer.ContextBuilder(referrer);
     
     if(!!mtcNow && !!rfrCtx){
       // 今イラストのページに居り、直前のページがコンテキストのページである -> コンテキストの新規作成
       this.headContext = this.tailContext = rfrCtx;
       this.clearContextUrl();
       return true;
     }else{
       var mtcRfr = referrer.match(EXP_ILLUST_DETAIL);
       if(!!mtcNow && !!mtcRfr){
         // 今イラストのページに居り、直前のページもイラストのページである
	 if(recentContextUrl){
	   // 直前のコンテキストがある
	   this.headContext = this.tailContext = pcv.contextViewer.ContextBuilder(recentContextUrl);
	   return true;
	 }else{
	   return false;
	 }
       }else if(!mtcNow && !!mtcRfr){
	  // 今はイラストのページに居らず、しかし前のページはイラストのページである
	  this.clearContextUrl();
	  return false;
       }else if(!!mtcNow && !mtcRfr && recentContextUrl){
         // 今イラストのページに居り、直前のページはイラストのページではないが、直前のコンテキストがある
	   this.headContext = this.tailContext = pcv.contextViewer.ContextBuilder(recentContextUrl);
	   return true;
       }else{
         return false;
       }
     }
   };

  FrontController.prototype.saveContextUrl = function(ctxUrl){
    pcv.contextViewer.sessionContextStorage("recentContextUrl", ctxUrl);
  };

  FrontController.prototype.clearContextUrl = function(){
    pcv.contextViewer.sessionContextStorage("recentContextUrl", null);
  };

  FrontController.prototype.addContextAsync = function(dirc){
    var dfd = $.Deferred();
    var self = this;
    var method = "get" + ((dirc === "head") ? "Prev" : "Next") + "Async";
    $.when(this[dirc + "Context"][method]()).done(function(ctx){
      $.when(ctx.getPagesAsync()).done(function(pages){
        self[dirc + "Context"] = ctx;
        self.view["addContextTo" + Uc(dirc)](ctx);
        dfd.resolve(ctx);
      }).fail(function(){dfd.reject();});
    }).fail(function(){dfd.reject();});
    return dfd.promise();
  };

  return FrontController;
})();
