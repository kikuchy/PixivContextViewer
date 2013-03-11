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

  var FrontController = function(){
    var self = this;
    this.view = new pcv.contextViewer.View(this);
    $.when(this.checkExecuteAsync()).done(function(show){
      if(show){
	$.when(self.getInitialContextAsync()).done(function(ctx){
	  self.view.initializeView(ctx);
	});
      }
    });
  };

  FrontController.prototype.checkExecuteAsync = function(){
    var dfd = $.Deferred();
    chrome.extension.sendMessage(req("shouldBeShow", [document.referrer, document.location.href]), function(response){
      try{
        var res = chSuc(response);
	dfd.resolve(res);
      }catch(e){
	dfd.reject(e);
      }
    });
    return dfd.promise();
  };

  FrontController.prototype.getInitialContextAsync = function(){
    var dfd = $.Deferred();
    chrome.extension.sendMessage(req("getInitialContextAsync"), function(response){
      try{
	var res = chSuc(response);
        dfd.resolve(res);
      }catch(e){
        dfd.reject(e);
      }
    });
    return dfd.promise();
  };

  FrontController.prototype.saveContextAsync = function(ctxUrl){
    var dfd = $.Deferred();
    chrome.extension.sendMessage(req("pushContextHistory", [location.href, ctxUrl]), function(response){
      try{
	var res = chSuc(response);
        dfd.resolve(res);
      }catch(e){
        dfd.reject(e);
      }
    });
    return dfd.promise();
  };

  return FrontController;
})();
