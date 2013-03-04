var PageCollection = (function($){
	var PageCollection = function(pageOf){
		this.pageOf = pageOf || 1;
		this._nextPC = null;
		this._prevPC = null;
	};
	PageCollection.prototype.next = function(){
		if(this._nextPC) return this._nextPC;
		return this._nextPC = new PageCollection(this.pageOf+1);
	};
	PageCollection.prototype.prev = function(){
		if(this._prevPC) return this._prevPC;
		return this._prevPC = new PageCollection(this.pageOf-1);
	};
	return PageCollection;
})(document.jQuery);
