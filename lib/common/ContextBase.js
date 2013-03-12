pcv = pcv || {};
pcv.contextViewer = pcv.contextViewer || {};
pcv.contextViewer.ContextBase = (function($){
  var ContextBase = function(url){
    this.url = url;
    this.pages = [];
    this.hasBeenParsed = false;
    this.hasNext = false;
    this.hasPrev = false;
    this.totalPages = 0;
  };

  ContextBase.prototype.getPagesAsync = function(){
    throw "this method must be implemented.";
  };

  ContextBase.prototype.getTotalPagesAsync = function(){
    throw "this method must be implemented.";
  };

  ContextBase.prototype.getHasNextAsync = function(){
    throw "this method must be implemented.";
  };

  ContextBase.prototype.getHasPrevAsync = function(){
    throw "this method must be implemented.";
  };

  return ContextBase;
})(jQuery);
