var PixivContextViewerView = (function ($) {
    var PixivContextViewerView = function (vcId) {
        this._$viewerContainer = $(vcId);
        $(document).append(this._$viewerContent);
    };
    PixivContextViewerView.prototype.addPagesToHead = function (pc) {
        for (var i = 0, l = pc.length; i < l; i++) {
        }
    };
    PixivContextViewerView.prototype.addPagesToTail = function (pc) {
        for (var i = 0, l = pc.length; i < l; i++) {
        }
    };
    PixivContextViewerView.prototype.touchBottomOfList = function (e) {
    };
    PixivContextViewerView.prototype.touchTopOfList = function (e) {
    };
    return PixivContextViewerView;
})(jQuery);