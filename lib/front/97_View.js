pcv = pcv || {};
pcv.contextViewer = pcv.contextViewer || {};
pcv.contextViewer.View = (function($){
  var PAGE_WIDTH = 150 + 15 * 2;
  var LOADING_WIDTH = 36 + 6 * 2;
  var EXP_ID = /id=(\d+)/;

  /**
   * Constructor. it needs FrontController;
   */
  var View = function(frontController){
    this.controller = frontController;
    this.$pcvWindow = null;
    this.artTemplate = Handlebars.compile(pcv.contextViewer.templates.page_html_mustache);
    this.contextWidth = 0;
    this.id = parseInt(document.location.href.match(EXP_ID)[1]);
  };

  /**
   * Initialize this instance and DOM with jQuery from templates.
   */
  View.prototype.initializeView = function(context){
    var windowTmpl = Handlebars.compile(pcv.contextViewer.templates.viewer_html_mustache);
    this.$pcvWindow = $(windowTmpl(""));
    $("body").append(this.$pcvWindow);
    var self = this;
    this.$pcvWindow.on("click", "a.pcv-work", function(){
      self.controller.saveContextAsync(this.dataset.context);
    });
    for(var i = 0, l = context.pages.length, $li; i < l; i++){
      $li = $(this.artTemplate(context.pages[i]));
      if(context.pages[i].id === this.id){
        $li.addClass("here");
	hereIdx = i;
      }
      $("#pcv-list", this.$pcvWindow).append($li);
    }
    this.centeringListToHere(hereIdx);

    this.contentWidth = context.pages.length * PAGE_WIDTH;
    if(context.hasPrev){
      $(".pcv-loading.left").removeClass("disable");
      this.contentWidth += LOADING_WIDTH;
    }
    if(context.hasNext){
      $(".pcv-loading.right").removeClass("disable");
      this.contentWidth += LOADING_WIDTH;
    } 
    $("#pcv-contents").css("width", this.contentWidth + "px");
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

  return View;
})(jQuery);
