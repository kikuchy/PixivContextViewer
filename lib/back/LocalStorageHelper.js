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
      return storage;
    })(prefix || "", suffix || "");
  };
  return LocalStorageHelper;
})();
