pcv = pcv || {};
pcv.contextViewer = pcv.contextViewer || {};
pcv.contextViewer.LocalStorageHelper = (function(){
  var LocalStorageHelper = function(prefix, suffix){
    return (function(pre, suff){
      var prefix = pre;
      var suffix = suff;
      var storage = function(name, value){
        if(!name) return;
	var key = prefix + name + suffix;
	switch(value){
	  case undefined:
	    return JSON.parse(localStorage.getItem(key));
	    break;
	  case null:
	    localStorage.removeItem(key);
	    break;
	  default:
	    localStorage.setItem(key, JSON.stringify(value));
	}
	return;
      };
      storage.each = function(fnc){
	var pat = new RegExp("^" + prefix + "(.*)" + suffix + "$");
        for(key in localStorage){
          var m = key.match(pat);
	  if(m){
	    fnc.apply(this, [m[1], localStorage.getItem(key)]);
	  }
	}
      };
      return storage;
    })(prefix || "", suffix || "");
  };
  return LocalStorageHelper;
})();
