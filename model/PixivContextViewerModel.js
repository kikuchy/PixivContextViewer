var PixivContextViewerModel = (function () {
    var PixivContextViewerModel = function (pc) {
        this._contextPC = pc;
        this._isLoading = false;
    };
    PixivContextViewerModel.prototype.getNowContext = function () {
        return this._contextPC;
    };
    PixivContextViewerModel.prototype.isLoading = function () {
        return this._isLoading;
    };
    return PixivContextViewerModel;
})();