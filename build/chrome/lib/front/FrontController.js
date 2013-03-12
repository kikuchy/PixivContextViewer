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

  var FrontController = function(){
    this.headContext = null;
    this.tailContext = null;
    var self = this;
    this.view = new pcv.contextViewer.View(this);
    $.when(this.checkExecuteAsync()).done(function(show){
      if(show){
	$.when(self.getInitialContextAsync()).done(function(ctx){
          self.headContext = ctx;
	  self.tailContext = ctx;
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

  FrontController.prototype.addContextAsync = function(dirc){
    var dfd = $.Deferred();
    var self = this;
    var method = "_loadContextAsync";
    $.when(this._loadContextAsync(dirc)).done(function(ctx){
      self[dirc + "Context"] = ctx;
      self.view["addContextTo" + Uc(dirc)](ctx);
      dfd.resolve(ctx);
    }).fail(function(){dfd.reject();});
    return dfd.promise();
  };

  FrontController.prototype._loadContextAsync = function(dirc){
    var dfd = $.Deferred();
    var method = "get" + ((dirc === "head") ? "Prev" : "Next") + "ContextAsync";
    var arg = this[dirc + "Context"];
    chrome.extension.sendMessage(req(method, [arg]), function(response){
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
