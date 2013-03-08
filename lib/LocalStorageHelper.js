var LocalStorageHelper = (function(){
  var LocalStorageHelper = function(prefix, postfix){
    return (function(pre, post){
      var prefix = pre;
      var postfix = post;
      var storage = function(name, value){
        if(!name) return;
	var key = prefix + name + postfix;
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
    })(prefix || "", postfix || "");
  };
  return LocalStorageHelper;
})();
