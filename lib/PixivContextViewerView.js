var PixivContextViewerView = (function(){
  var PixivContextViewerView = function(){
    this.$pcvWindow = this._initDom();
  };
  PixivContextViewerView.prototype._initDom = function(){
    return $('<div id="pcv-window"><div id="pcv-content"></div></div>')
  };
  return PixivContextViewerView;
})();
