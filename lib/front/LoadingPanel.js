pcv = pcv || {};
pcv.contextViewer = pcv.contextViewer || {};
pcv.contextViewer.LoadingPanel = (function(){
  var PAGE_WIDTH = 150 + 15 * 2;
  var LOADING_WIDTH = 36 + 6 * 2;
  var SCR_MARGIN = 500;
  var DISABLE = "disable";
  var STAT_DIS = "disabled", STAT_LOAD = "loading", STAT_ENA = "enabled";

  var LoadingPanel = function($l){
    this.$loading = $l;
    this.state = STAT_DIS;
  };

  LoadingPanel.prototype.isEnabled = function(){
    return this.state === STAT_ENA;
  };

  LoadingPanel.prototype.enable = function(){
    this.$loading.removeClass(DISABLE);
    this.state = STAT_ENA;
  };

  LoadingPanel.prototype.disable = function(){
    this.$loading.addClass(DISABLE);
    this.state = STAT_DIS;
  };

  LoadingPanel.prototype.loading = function(){
    this.$loading.removeClass(DISABLE);
    this.state = STAT_LOAD;
  };

  LoadingPanel.prototype.onParentScroll = function($this, view){
      if(!this.isEnabled()) return false;
      var self = this;
      var ofs = $this.offset();
      var pos = Math.abs(ofs.left + LOADING_WIDTH / 2);
      var wWidth = view.$pcvWindow.width();
      if(wWidth + SCR_MARGIN > pos){
	var dirc = $this.hasClass("left") ? "head" : ($this.hasClass("right") ? "tail" : undefined);
	if(dirc){
          this.loading();
	  $.when(view.controller.addContextAsync(dirc)).done(function(ctx){
	    var show = false;
	    if(dirc === "head"){
	      show = ctx.hasPrev;
	    }else{
	      show = ctx.hasNext;
	    }
	    if(show){
	      self.enable();
	    }else{
	      self.disable();
	    }
	  }).fail(function(){
	    self.enable();
	  });
	}
      }
  };

  return LoadingPanel;
})();
