function URLSchemeComponent() {
	this.string = "";
}


URLSchemeComponent.prototype.constructor = URLSchemeComponent;


URLSchemeComponent.prototype.define = function() {
	this.constructor.call(this);
};


Object.defineProperty(URLSchemeComponent.prototype, 'valid', {
	get : function() {
		return this.string.search(URLSchemeComponent.SCHEME) != -1 ? true : false;
	},
	configurable : true,
	enumerable : true
})


URLSchemeComponent.prototype.copy = function(scheme) {
	this.string = scheme.string;
};


URLSchemeComponent.prototype.toString = function() {
	if (this.string.search(URLSchemeComponent.SCHEME) == -1) throw new Error(URLSchemeComponent.ERROR_MALFORMED);
	
	return this.string;
};



Object.defineProperty(URLSchemeComponent, 'VERSION', {value : "0.0.1"});

Object.defineProperty(URLSchemeComponent, 'SCHEME', {value : /^[a-z][0-9a-z\+\-\.]*$/});
Object.defineProperty(URLSchemeComponent, 'SCHEME_URL', {value : /(^[a-z][0-9a-z\+\-\.]*)\:/});

Object.defineProperty(URLSchemeComponent, 'ERROR_ARGUMENT', {value : "invalid argument"});
Object.defineProperty(URLSchemeComponent, 'ERROR_MALFORMED', {value : "malformed url component"});


URLSchemeComponent.String = function(string) {
	if (typeof string != 'string') throw new TypeError(URLSchemeComponent.ERROR_ARGUMENT);
	
	if (string.search(URLSchemeComponent.SCHEME) == -1) throw new Error(URLSchemeComponent.ERROR_MALFORMED);
	
	var res = new URLSchemeComponent();
	
	res.string = string;
	
	return res;
};

URLSchemeComponent.StringURL = function(string) {
	if (typeof string != 'string') throw new TypeError(URLSchemeComponent.ERROR_ARGUMENT);
	
	var match = string.match(URLSchemeComponent.SCHEME_URL);
	
	if (!match) return new URLSchemeComponent();
	
	return URLSchemeComponent.String(match[1]);
};


URLSchemeComponent.copy = function(scheme) {
	var res = new URLSchemeComponent();
	
	res.string = scheme.string();
	
	return res;
};


URLSchemeComponent.toString = function() {
	return "[URLSchemeComponent-" + URLSchemeComponent.VERSION + "]";
}




function URLNameComponent() {
	this.segment = [];
}


Object.defineProperty(URLNameComponent.prototype, 'FORWARD', {value : 0x0});
Object.defineProperty(URLNameComponent.prototype, 'REVERSE', {value : 0x1});


URLNameComponent.prototype.constructor = URLNameComponent;


URLNameComponent.prototype.define = function() {
	this.constructor.call(this);
}


Object.defineProperty(URLNameComponent.prototype, 'forward', {
	get : function() {
		var res = "";
		
		if (!this.segment.length) return res;
		
		for (var i = this.segment.length - 1, str = this.segment[i]; i > -1; str = this.segment[--i]) res += str + ".";
		
		return res.substr(0, res.length - 1);
	},
	set : function(string) {
		if (typeof string != 'string') throw new TypeError(URLNameComponent.ERROR_ARGUMENT);
		
		var name = string.split(".");
		
		this.segment = [];
		
		for (var i = name.length - 1, str = name[i]; i > -1; str = name[--i]) this.segment.push(str);
	},
	configurable : true,
	enumerable : true
});

Object.defineProperty(URLNameComponent.prototype, 'reverse', {
	get : function() {		
		if (!this.segment.length) return "";
		
		return this.segment.join(".");
	},
	set : function(string) {
		if (typeof string != 'string') throw new TypeError(URLNameComponent.ERROR_ARGUMENT);
		
		this.segment = string.split(".");
	},
	configurable : true,
	enumerable : true
});


Object.defineProperty(URLNameComponent.prototype, 'valid', {
	get : function() {
		if (!this.segment.length) return false;
		
		for (var i = 0, name = this.segment[0]; name; name = this.segment[++i]) {
			if (name.search(URLNameComponent.NAME_SEGMENT) == -1) return false;
		}
		
		return true;
	},
	configurable : true,
	enumerable : true
});


URLNameComponent.prototype.copy = function(name) {
	this.segment = name.segment.slice(0);
};


URLNameComponent.prototype.toString = function(flags) {
	var res = flags & 0x1 ? this.reverse : this.forward;
	
	if (res.search(URLNameComponent.NAME) == -1) throw new Error(URLNameComponent.ERROR_MALFORMED);
	
	return res;
};



Object.defineProperty(URLNameComponent, 'VERSION', {value : "0.0.1"});

Object.defineProperty(URLNameComponent, 'NAME', {value : /^([0-9a-z\-\.]|%[0-9A-F]{2})+$/});
Object.defineProperty(URLNameComponent, 'NAME_URL', {value : /^(?:(?:[^\/]*\:)?\/{2}(?:[^\/]*@)?)((?:[0-9a-z\-\.]|%[0-9A-F]{2})+)(?:\:|\/|\?|#|$)/});
Object.defineProperty(URLNameComponent, 'NAME_SEGMENT', {value : /^([0-9a-z\-]|%[0-9A-F]{2})+$/})

Object.defineProperty(URLNameComponent, 'ERROR_ARGUMENT', {value : "invalid argument"});
Object.defineProperty(URLNameComponent, 'ERROR_MALFORMED', {value : "malformed url component"});


URLNameComponent.String = function(string, flags) {
	if (typeof string != 'string' || flags != null && (typeof flags != 'number' || flags >> 0 != flags)) throw new TypeError(URLNameComponent.ERROR_ARGUMENT);
	
	if (string.search(URLNameComponent.NAME) == -1) throw new Error(URLNameComponent.ERROR_MALFORMED);
	
	var res = new URLNameComponent();
	
	if (flags & 0x1) res.reverse = string;
	else res.forward = string;
	
	return res;
};

URLNameComponent.StringURL = function(string) {
	if (typeof string != 'string') throw new TypeError(URLNameComponent.ERROR_ARGUMENT);
	
	var match = string.match(URLNameComponent.NAME_URL);

	if (!match) return new URLNameComponent();
	
	return URLNameComponent.String(match[1], 0x0);
};


URLNameComponent.copy = function(name) {
	var res = new URLNameComponent();
	
	res.segment = name.segment.slice(0);
	
	return res;
};


URLNameComponent.toString = function() {
	return "[URLNameComponent-" + URLNameComponent.VERSION + "]";
};




function URLPathComponent() {
	this.segment = [];
}


URLPathComponent.prototype.constructor = URLPathComponent;


URLPathComponent.prototype.define = function() {
	this.constructor.call(this);
}


Object.defineProperty(URLPathComponent.prototype, 'path', {
	get : function() {
		if (!this.segment.length) return "";
		
		var res = this.segment.join("/");
		
		if (res.search(URLPathComponent.PATH) == -1) throw new Error(URLPathComponent.ERROR_MALFORMED);
		
		return res;
	},
	set : function(string) {
		if (typeof string != 'string') throw new TypeError(URLPathComponent.ERROR_MALFORMED);
		
		if (!string) {
			this.segment = [];
			return;
		}
		
		if (string.search(URLPathComponent.PATH) == -1) throw new Error(URLPathComponent.ERROR_MALFORMED);
		
		this.segment = string.split("/");
	},
	configurable : true,
	enumerable : true
});


Object.defineProperty(URLPathComponent.prototype, 'valid', {
	get : function() {
		if (!this.segment.length) return true;
		
		for (var i = 0, path = this.segment[0]; path; path = this.segment[++i]) {
			if (path.search(URLPathComponent.PATH_SEGMENT) == -1) return false;
		}
		
		return true;
	},
	configurable : true,
	enumerable : true
});


URLPathComponent.prototype.copy = function(path) {
	this.segment = path.segment.slice(0);
};


URLPathComponent.prototype.toString = function() {
	return this.path;
};



Object.defineProperty(URLPathComponent, 'VERSION', {value : "0.0.1"});

Object.defineProperty(URLPathComponent, 'PATH', {value : /^([0-9A-Za-z\!\$&'\(\)\*\+,\-\.\/\:;\=@_~]|%[0-9A-F]{2})*$/});
Object.defineProperty(URLPathComponent, 'PATH_URL', {value : /^(?:[^\/]*\:)?(?:\/{2}[^\/]*)?((?:[\!\$\&'\(\)\*\+\,\-\.\/0-9\:;\=@A-Z_a-z~]|%[0-9A-F]{2})*)(?:\?|#|$)/});
Object.defineProperty(URLPathComponent, 'PATH_SEGMENT', {value : /^([0-9A-Za-z\!\$&'\(\)\*\+,\-\.\/\:;\=@_~]|%[0-9A-F]{2})*$/});

Object.defineProperty(URLPathComponent, 'ERROR_ARGUMENT', {value : "invalid argument"});
Object.defineProperty(URLPathComponent, 'ERROR_MALFORMED', {value : "malformed url component"})


URLPathComponent.String = function(string) {
	var res = new URLPathComponent();
	res.path = string;
	return res;
};

URLPathComponent.StringURL = function(string) {
	if (typeof string != 'string') throw new TypeError(URLPathComponent.ERROR_ARGUMENT);
	
	var res = new URLPathComponent();
	
	//var match = string.match(URLPathComponent.PATH_URL_AUTH) || string.match(URLPathComponent.PATH_URL_SCHEME);
	var match = string.match(URLPathComponent.PATH_URL);
	
	if (match) res.path = match[1];
	
	return res;
};


URLPathComponent.copy = function(path) {
	var res = new URLPathComponent();
	
	res.segment = path.segment.slice(0);
	
	return res;
};


URLPathComponent.toString = function() {
	return "[URLPathComponent-" + URLPathComponent.VERSION + "]";
}