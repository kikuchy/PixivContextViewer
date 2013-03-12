pcv = pcv || {};
pcv.contextViewer = pcv.contextViewer || {};
pcv.contextViewer.View = (function($){
  var PAGE_WIDTH = 150 + 15 * 2;
  var LOADING_WIDTH = 36 + 6 * 2;
  var SCR_MARGIN = 500;
  var EXP_ID = /id=(\d+)/;

  /**
   * Constructor. it needs FrontController for initialize.
   */
  var View = function(frontController){
    this.controller = frontController;
    this.$pcvWindow = null;
    this.artTemplate = Handlebars.compile(pcv.contextViewer.templates.page_html_mustache);
    this.contextWidth = 0;
    this.id = parseInt(document.location.href.match(EXP_ID)[1]);
    this.headLoading = null;
    this.tailLoading = null;
  };

  View.prototype._makeArtDOM = function(art){
    var self = this;
    var $li = $(this.artTemplate(art)).on("parentScroll", function(){
      var ofs = $li.offset();
      var pos = Math.abs(ofs.left + PAGE_WIDTH / 2);
      var wWidth = self.$pcvWindow.width();
      if(wWidth + SCR_MARGIN > pos){
	// load image
      }
    });
    return $li;
  };

  /**
   * Initialize this instance and DOM with jQuery from templates.
   */
  View.prototype.initializeView = function(context){
    var windowTmpl = Handlebars.compile(pcv.contextViewer.templates.viewer_html_mustache);
    this.$pcvWindow = $(windowTmpl(""));
    $("body").append(this.$pcvWindow);
    this.headLoading = new pcv.contextViewer.LoadingPanel($(".pcv-loading.left", this.$pcvWindow));
    this.tailLoading = new pcv.contextViewer.LoadingPanel($(".pcv-loading.right", this.$pcvWindow));
    var self = this;
    // イベントしかける系処理
    this.$pcvWindow.on("click", "a.pcv-work", function(){
      self.controller.saveContextUrl(this.dataset.context);
    });
    this.$pcvWindow.on("scroll", function(e){
      var offset = $("#pcv-contents", this.$pcvWindow).offset();
      $("li.pcv-image-item").trigger("parentScroll", [{parentOffset: offset}]);
      $(".pcv-loading").trigger("parentScroll", [{parentOffset: offset}]);
    });
    var hereIdx = -1;
    for(var i = 0, l = context.pages.length, $li; i < l; i++){
      // $li = $(this.artTemplate(context.pages[i]));
      $li = this._makeArtDOM(context.pages[i]);
      if(context.pages[i].id === this.id){
        $li.addClass("here");
	hereIdx = i;
      }
      $("#pcv-list", this.$pcvWindow).append($li);
    }

    this.contentWidth = context.pages.length * PAGE_WIDTH;
    if(context.hasPrev){
      this.headLoading.enable();
      this.contentWidth += LOADING_WIDTH;
    }
    if(context.hasNext){
      this.tailLoading.enable();
      this.contentWidth += LOADING_WIDTH;
    } 
    this.headLoading.$loading.on("parentScroll", function(){
      self.headLoading.onParentScroll.apply(self.headLoading, [$(this), self]);
    });
    this.tailLoading.$loading.on("parentScroll", function(){
      self.tailLoading.onParentScroll.apply(self.tailLoading, [$(this), self]);
    });
    $("#pcv-contents").css("width", this.contentWidth + "px");
    this.centeringListToHere(hereIdx);
    this.$pcvWindow.removeClass("invisible");
  };

  /**
   * Centering idx-th arts at the list.
   */
  View.prototype.centeringListToHere = function(idx){
    var wWidth = this.$pcvWindow.width();
    var hWidth = PAGE_WIDTH;
    // TODO: 追加ロード領域を出したときのサイズを考慮してない
    var hPos = PAGE_WIDTH * idx;
    var trgPos = hPos - wWidth/2 + hWidth/2;
    this.$pcvWindow.scrollLeft(trgPos);
  };

  View.prototype.addContextToHead = function(context){
    for(var i = context.pages.length - 1, l = -1; i > l; i--){
      $li = this._makeArtDOM(context.pages[i]);
      $("#pcv-list", this.$pcvWindow).prepend($li);
    }
    this.contentWidth += context.pages.length * PAGE_WIDTH;
    $("#pcv-contents").css("width", this.contentWidth + "px");
  };
  View.prototype.addContextToTail = function(context){
    for(var i = 0, l = context.pages.length; i < l; i++){
      $li = this._makeArtDOM(context.pages[i]);
      $("#pcv-list", this.$pcvWindow).append($li);
    }
    this.contentWidth += context.pages.length * PAGE_WIDTH;
    $("#pcv-contents").css("width", this.contentWidth + "px");
  };

  return View;
})(jQuery);
