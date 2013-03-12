pcv = pcv || {};
pcv.contextViewer = pcv.contextViewer || {};
pcv.contextViewer.StorageHelper = (function(){
  var StorageHelper = function(storage, prefix, suffix){
    return (function(storage, pre, suff){
      var prefix = pre;
      var suffix = suff;
      var helper = function(name, value){
        if(!name) return;
	var key = prefix + name + suffix;
	switch(value){
	  case undefined:
	    return JSON.parse(storage.getItem(key));
	    break;
	  case null:
	    storage.removeItem(key);
	    break;
	  default:
	    storage.setItem(key, JSON.stringify(value));
	}
	return;
      };
      helper.each = function(fnc){
	var pat = new RegExp("^" + prefix + "(.*)" + suffix + "$");
        for(key in storage){
          var m = key.match(pat);
	  if(m){
	    fnc.apply(this, [m[1], storage.getItem(key)]);
	  }
	}
      };
      return helper;
    })(storage || localStorage, prefix || "", suffix || "");
  };
  return StorageHelper;
})();
