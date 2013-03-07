var LocalStorageHelper = (function(){
  var _prefix = "";
  var _postfix = "";

  var LocalStorageHelper = function(name, value){
    var key = _prefix + name + _postfix;
    switch(value){
      case undefined:
        return JSON.parse(localStorage[key]);
	break;
      case null:
        localStorage.removeItem(key);
	break;
      default:
        localStorage[key] = JSON.stringify(value);
    }
  };
  LocalStorageHelper.prefix = function(p){
    if(p){
      _prefix = p;
    }else{
      return _prefix;
    }
  };

  LocalStorageHelper.postfix = function(p){
    if(p){
      _postfix = p;
    }else{
      return _postfix;
    }
  };
  return LocalStorageHelper;
})();
