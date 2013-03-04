var PixivContextViewerController = (function($){
	var PixivContextViewerController = function(model, view){
	    this.model = new PixivContextViewerModel();
	    this.view = new PixivContextViewerView("<div><div><ul id='cv_list'></ul></div></div>");
	};
	PixivContextViewerController.prototype.loadNextPageCollection = function(){
	};
	PixivContextViewerController.prototype.loadPrevPageCollection = function(){
	};
	return PixivContextViewerController;
})(jQuery);

(function () {
    var controller = new PixivContextViewerController();
})();