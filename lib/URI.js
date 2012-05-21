/**
 * Creates a new Instance
 * @class Uniform Resource Identifier <em>component</em> manipulation
 * @author <a href="mailto:mail@christoph-kettelhoit.de">Christoph Kettelhoit</a>
 * @param  {Int}          type The component type
 * @return {URIComponent}
 * @throws {TypeError} <code>ERROR_ARGUMENT</code> if <code>type</code> is not a valid <code>Int</code>
 */
function URIComponent(type) {
	var cmp, uri;
	
	switch(type) {
		case this.TYPE_SCHEME :
			cmp = URIComponent.SCHEME;
			uri = URIComponent.SCHEME_URI;
			break;
		case this.TYPE_USER :
			cmp = URIComponent.USER;
			uri = URIComponent.USER_URI;
			break;
		case this.TYPE_NAME :
			cmp = URIComponent.NAME;
			uri = URIComponent.NAME_URI;
			break;
		case this.TYPE_PORT :
			cmp = URIComponent.PORT;
			uri = URIComponent.PORT_URI;
			break;
		case this.TYPE_PATH :
			cmp = URIComponent.PATH;
			uri = URIComponent.PATH_URI;
			break;
		case this.TYPE_QUERY :
			cmp = URIComponent.QUERY;
			uri = URIComponent.QUERY_URI;
			break;
		case this.TYPE_FRAGMENT :
			cmp = URIComponent.FRAGMENT;
			uri = URIComponent.FRAGMENT_URI;
			break;
		default : throw new TypeError(URIComponent.ERROR_ARGUMENT);
	}
	
	/**
	 * The character data
	 * @type String
	 */
	this.chars = "";
	
	/**
	 * The type
	 * <p>[readonly]</p>
	 * @name type
	 * @memberOf URIComponent#
	 * @type Int
	 */
	Object.defineProperty(this, 'type', {
		value : type,
		configurable : true,
		enumerable : true
	});
	
	/**
	 * The <em>component</em> regular expression
	 * <p>[readonly]</p>
	 * @name componentExpression
	 * @memberOf URIComponent#
	 * @type RegExp
	 */
	Object.defineProperty(this, 'componentExpression', {
		value : cmp,
		configurable : true,
		enumerable : true
	});
	/**
	 * The <em>uri</em> regular expression
	 * <p>[readonly]</p>
	 * @name uriExpression
	 * @memberOf URIComponent#
	 * @type RegExp
	 */
	Object.defineProperty(this, 'uriExpression', {
		value : uri,
		configurable : true,
		enumerable : true
	});
}


/**
 * The scheme <em>component</em> type
 * @constant
 * @name TYPE_SCHEME
 * @memberOf URIComponent#
 * @type Int
 */
Object.defineProperty(URIComponent.prototype, 'TYPE_SCHEME', {value : 0x01});
/**
 * The user <em>component</em> type
 * @constant
 * @name TYPE_USER
 * @memberOf URIComponent#
 * @type Int
 */
Object.defineProperty(URIComponent.prototype, 'TYPE_USER', {value : 0x02});
/**
 * The name <em>component</em> type
 * @constant
 * @name TYPE_NAME
 * @memberOf URIComponent#
 * @type Int
 */
Object.defineProperty(URIComponent.prototype, 'TYPE_NAME', {value : 0x04});
/**
 * The port <em>component</em> type
 * @constant
 * @name TYPE_PORT
 * @memberOf URIComponent#
 * @type Int
 */
Object.defineProperty(URIComponent.prototype, 'TYPE_PORT', {value : 0x08});
/**
 * The path <em>component</em> type
 * @constant
 * @name TYPE_PATH
 * @memberOf URIComponent#
 * @type Int
 */
Object.defineProperty(URIComponent.prototype, 'TYPE_PATH', {value : 0x10});
/**
 * The query <em>component</em> type
 * @constant
 * @name TYPE_QUERY
 * @memberOf URIComponent#
 * @type Int
 */
Object.defineProperty(URIComponent.prototype, 'TYPE_QUERY', {value : 0x20});
/**
 * The fragment <em>component</em> type
 * @constant
 * @name TYPE_FRAGMENT
 * @memberOf URIComponent#
 * @type Int
 */
Object.defineProperty(URIComponent.prototype, 'TYPE_FRAGMENT', {value : 0x40});


/**
 * The constructor
 * @type Function
 */
URIComponent.prototype.constructor = URIComponent;


/**
 * (Re)defines the instance
 * @param  {Int} type The component type
 * @return {void}
 */
URIComponent.prototype.define = function(type) {
	this.constructor.call(this, type);
};


/**
 * The string representation
 * @name string
 * @memberOf URIComponent#
 * @type String
 * @throws {Error}     <code>ERROR_MALFORMED</code> if getting a invalid <em>component</em>
 * @throws {TypeError} <code>ERROR_ARGUMENT</code> if not setting a <code>String</code>
 * @throws {Error}     <code>ERROR_MALFORMED</code> if setting a invalid <em>component</em>
 */
Object.defineProperty(URIComponent.prototype, 'string', {
	get : function() {
		if (this.chars.search(this.componentExpression) == -1) throw new Error(URIComponent.ERROR_MALFORMED);
		
		return this.chars;
	},
	set : function(string) {
		if (typeof string != 'string') throw new TypeError(URIComponent.ERROR_ARGUMENT);
		
		if (string.search(this.componentExpression) == -1) throw new Error(URIComponent.ERROR_MALFORMED);
		
		this.chars = string;
	},
	configurable : true,
	enumerable : true
});


/**
 * <code>true</code> if the instance is empty, <code>false</code> otherwise
 * <p>[readonly]</p>
 * @name empty
 * @memberOf URIComponent#
 * @type Boolean
 */
Object.defineProperty(URIComponent.prototype, 'empty', {
	get : function() {
		return this.chars.length ? false : true;
	},
	configurable : true,
	enumerable : true
});

/**
 * <code>true</code> if the instance is a valid <em>component</em>, <code>false</code> otherwise
 * <p>[readonly]</p>
 * @name valid
 * @memberOf URIComponent#
 * @type Boolean
 */
Object.defineProperty(URIComponent.prototype, 'valid', {
	get : function() {
		return this.chars.search(this.componentExpression) != -1 ? true : false;
	},
	configurable : true,
	enumerable : true
});


/**
 * The copy of <code>component</code>
 * @param  {URIComponent} component The component
 * @return {void}
 * @throws {TypeError} <code>ERROR_ARGUMENT</code> if <code>component</code> is not a <code>URIComponent</code> instance
 */
URIComponent.prototype.copy = function(component) {
	if (!(component instanceof URIComponent)) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	
	URIComponent.call(this, component.type);
	
	this.chars = component.chars;
};


/**
 * Returns a string representation of the <em>component</em>
 * @return {String}
 */
URIComponent.prototype.toString = function() {
	return this.string;
};



/**
 * The version string
 * @static
 * @constant
 * @name VERSION
 * @memberOf URIComponent
 * @type String
 */
Object.defineProperty(URIComponent, 'VERSION', {value : "0.1.2"});

/**
 * The scheme <em>component</em> regular expression
 * @static
 * @constant
 * @name SCHEME
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'SCHEME', {value : /^[a-z][0-9a-z\+\-\.]*$/});
/**
 * The scheme <em>uri</em> regular expression
 * @static
 * @constant
 * @name SCHEME_URI
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'SCHEME_URI', {value : /^([a-z][0-9a-z\+\-\.]*)\:/});
/**
 * The user <em>component</em> regular expression
 * @static
 * @constant
 * @name USER
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'USER', {value : /^([\!\$&'\(\)\*\+\,\-\.0-9\:;\=A-Z_a-z~]|%[0-9A-F]{2})+$/});
/**
 * The user <em>uri</em> regular expression
 * @static
 * @constant
 * @name USER_URI
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'USER_URI', {value : /^(?:[^\/]+\:)?\/{2}(([\!\$&'\(\)\*\+\,\-\.0-9\:;\=A-Z_a-z~]|%[0-9A-F]{2})+)(?:@[^\/]+)/});
/**
 * The name <em>component</em> regular expression
 * @static
 * @constant
 * @name NAME
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'NAME', {value : /^([0-9a-z\-\.]|%[0-9A-F]{2})+$/});
/**
 * The name <em>segment</em> regular expression
 * @static
 * @constant
 * @name NAME_SEGMENT
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'NAME_SEGMENT', {value : /^([0-9a-z\-]|%[0-9A-F]{2})+$/});
/**
 * The name <em>uri</em> regular expression
 * @static
 * @constant
 * @name NAME_URI
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'NAME_URI', {value : /^(?:[^\/]*\:)?\/{2}(?:[^\/]*@)?((?:[0-9a-z\-\.]|%[0-9A-F]{2})+)(?:\:[^@]*\/|\/|\?|#|$)/});
/**
 * The port <em>component</em> regular expression
 * @static
 * @constant
 * @name PORT
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'PORT', {value : /^\d+$/});
/**
 * The port <em>uri</em> regular expression
 * @static
 * @constant
 * @name PORT_URI
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'PORT_URI', {value : /^(?:[^\/]*\:)?\/{2}[^\/]+\:(\d+)(?:\/|\?|#|$)/});
/**
 * The path <em>component</em> regular expression
 * @static
 * @constant
 * @name PATH
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'PATH', {value : /^([0-9A-Za-z\!\$&'\(\)\*\+,\-\.\/\:;\=@_~]|%[0-9A-F]{2})+$/});
/**
 * The path <em>segment</em> regular expression
 * @static
 * @constant
 * @name PATH_SEGMENT
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'PATH_SEGMENT', {value : /^([0-9A-Za-z\!\$&'\(\)\*\+,\-\.\/\:;\=@_~]|%[0-9A-F]{2})*$/});
/**
 * The path <em>uri</em> regular expression
 * @static
 * @constant
 * @name PATH_URI
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'PATH_URI', {value : /^(?:(?:(?:[^\/]+\:)?\/{2}[^\/\?#]*)|(?:[^\/]+\:)|(?=[^\:]))((?:[\!\$\&'\(\)\*\+\,\-\.\/0-9\:;\=@A-Z_a-z~]|%[0-9A-F]{2})+)(?:\?|#|$)/});
/**
 * The query <em>component</em> regular expression
 * @static
 * @constant
 * @name QUERY
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'QUERY', {value : /^([\!\$\&'\(\)\*\+\,\-\.\/0-9\:;\=\?@A-Z_a-z~]|%[0-9A-F]{2})+$/});
/**
 * The query <em>uri</em> regular expression
 * @static
 * @constant
 * @name QUERY_URI
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'QUERY_URI', {value : /(?:[^\?]*\?)((?:[\!\$\&'\(\)\*\+\,\-\.\/0-9\:;\=\?@A-Z_a-z~]|%[0-9A-F]{2})+)(?:#|$)/});
/**
 * The fragment <em>component</em> regular expression
 * @static
 * @constant
 * @name FRAGMENT
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'FRAGMENT', {value : /^([\!\$\&'\(\)\*\+\,\-\.\/0-9\:;\=\?@A-Z_a-z~]|%[0-9A-F]{2})+$/});
/**
 * The fragment <em>uri</em> regular expression
 * @static
 * @constant
 * @name FRAGMENT_URI
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'FRAGMENT_URI', {value : /(?:#)((?:[\!\$\&'\(\)\*\+\,\-\.\/0-9\:;\=\?@A-Z_a-z~]|%[0-9A-F]{2})+)$/});


/**
 * The <em>"invalid argument"</em> string
 * @static
 * @constant
 * @name ERROR_ARGUMENT
 * @memberOf URIComponent
 * @type String
 */
Object.defineProperty(URIComponent, 'ERROR_ARGUMENT', {value : "invalid argument"});
/**
 * The <em>"malformed uri component"</em> string
 * @static
 * @constant
 * @name ERROR_MALFORMED
 * @memberOf URIComponent
 * @type String
 */
Object.defineProperty(URIComponent, 'ERROR_MALFORMED', {value : "malformed uri component"});


/**
 * Returns a instance of <em>component</em> <code>type</code> extracted from <code>string</code>
 * @param  {String}       string   The <em>uri</em> string
 * @param  {Int}          type     The <em>component</em> type
 * @param  {URIComponent} [target] The target instance
 * @return {URIComponent}
 * @throws {TypeError} <code>ERROR_ARGUMENT</code> if <code>string</code> is not a <code>String</code>
 * @throws {TypeError} <code>ERROR_ARGUMENT</code> if <code>target</code> is not a <code>URIComponent</code> instance or <code>null</code>
 */
URIComponent.URIString = function(string, type, target) {
	if (typeof string != 'string') throw new TypeError(URIComponent.ERROR_ARGUMENT);

	if (target == null) target = new URIComponent(type);
	else if (!(target instanceof URIComponent)) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	else URIComponent.call(target, type);
	
	var match = string.match(target.uriExpression);
	
	if (match) target.chars = match[1];
	
	return target;
};

/**
 * Returns a instance of <em>component</em> <code>type</code> represented by <code>string</code>
 * @param  {String}       string   The <em>component</em> string
 * @param  {Int}          type     The <em>component</em> type
 * @param  {URIComponent} [target] The target instance
 * @return {URIComponent}
 * @throws {TypeError} <code>ERROR_ARGUMENT</code> if <code>string</code> is not a <code>String</code>
 * @throws {TypeError} <code>ERROR-ARGUMENT</code> if <code>target</code> is not a <code>URIComponent</code> instance or <code>null</code>
 */
URIComponent.ComponentString = function(string, type, target) {
	if (typeof string != 'string') throw new TypeError(URIComponent.ERROR_ARGUMENT);
		
	if (target == null) target = new URIComponent(type);
	else if (!(target instanceof URIComponent)) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	else URIComponent.call(target, type);
	
	if (string.search(target.componentExpression) == -1) throw new Error(URIComponent.ERROR_MALFORMED);
	
	target.chars = string;
	
	return target;
};


/**
 * Returns a copy of <code>component</code>
 * @param  {URIComponent} component The component
 * @return {URIComponent}
 * @throws {TypeError} <code>ERROR_ARGUMENT</code> if <code>component</code> is not a <code>URIComponent</code> instance
 */
URIComponent.copy = function(component) {
	if (!component || component.constructor != URIComponent) throw new Error(URIComponent.ERROR_ARGUMENT);
	
	var res = new URIComponent(component.type);
	
	res.chars = component.chars;
	
	return res;
};


/**
 * Returns a type-version string
 * @return {String}
 */
URIComponent.toString = function() {
	return "[URIComponent-" + URIComponent.VERSION + "]";
};




/**
 * Creates a new instance
 * @class Uniform Resource Identifier name <em>component</em> manipulation
 * @extends URIComponent
 * @requires URIComponent
 * @author <a href="mail@christoph-kettelhoit.de">Christoph Kettelhoit</a>
 * @returns {URINameComponent}
 */
function URINameComponent() {
	this.antetype.constructor.call(this, this.TYPE_NAME);
}


URINameComponent.prototype = new URIComponent(URIComponent.prototype.TYPE_NAME);


/**
 * The forward notation <em>alias</em>
 * @static
 * @constant
 * @name NAME_FORWARD
 * @memberOf URINameComponent#
 * @type Int
 */
Object.defineProperty(URINameComponent.prototype, 'NAME_FORWARD', {value : 0x0});
/**
 * The reverse notation <em>bit</em>
 * @static
 * @constant
 * @name NAME_REVERSE
 * @memberOf URINameComponent#
 */
Object.defineProperty(URINameComponent.prototype, 'NAME_REVERSE', {value : 0x1});


/**
 * The constructor
 * @type Function
 */
URINameComponent.prototype.constructor = URINameComponent;

/**
 * The prototype of the ancestor
 * @type Object
 */
URINameComponent.prototype.antetype = URIComponent.prototype;


/**
 * (Re)defines the instance
 * @return {void}
 */
URINameComponent.prototype.define = function() {
	this.antetype.constructor.call(this, this.TYPE_NAME);
};


/**
 * The reverse notation string representation
 * @name stringReverse
 * @memberOf URINameComponent#
 * @type String
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>string</code> is not a nonempty <code>String</code>
 */
Object.defineProperty(URINameComponent.prototype, 'stringReverse', {
	get : function() {
		var segment = this.string.split(".");
		
		segment.reverse();
		
		return segment.join(".");
	},
	set : function(string) {
		if (!string || typeof string != 'string') throw new TypeError(URIComponent.ERROR_ARGUMENT);
		
		var segment = string.split(".");
		
		segment.reverse();
		
		this.string = segment.join(".");
	},
	configurable : true,
	enumerable : true
});

/**
 * A reverse notation <em>segment</em> array copy
 * @name segment
 * @memberOf URINameComponent#
 * @type String[]
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if the set argument is not a nonempty <code>Array</code> of nonempty <code>String</code>s
 */
Object.defineProperty(URINameComponent.prototype, 'segment', {
	get : function() {
		var res = this.string.split(".");
		
		res.reverse();
		
		return res;
	},
	set : function(segment) {
		if (!segment || segment.constructor != Array || !segment.length) throw new TypeError(URIComponent.ERROR_ARGUMENT);
		
		var string = "";
		
		for (var i = segment.length - 1; i > -1; i--) {
			if (!segment[i] || typeof segment[i] != 'string') throw new TypeError(URIComponent.ERROR_ARGUMENT);
			
			string += segment[i] + ".";
		}
		
		this.string = string.substring(0, string.length - 1);
	},
	configurable : true,
	enumerable : true
});


/**
 * Returns a string representation of the <em>component</em>
 * @param  {Int}    [flags=URINameComponent#NAME_FORWARD] The flags
 * @return {String}
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>flags</code> is not a <code>Int</code> or <code>null</code>
 */
URINameComponent.prototype.toString = function(flags) {
	if (flags !== undefined && (typeof flags != 'number' || flags << 0 != flags)) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	
	flags = flags || this.NAME_FORWARD;
	
	return flags & this.NAME_REVERSE ? this.stringReverse : this.string;
};



/**
 * The version string
 * @static
 * @constant
 * @name VERSION
 * @memberOf URINameComponent
 * @type String
 */
Object.defineProperty(URINameComponent, 'VERSION', {value : "0.1.2"});


/**
 * Returns a instance extracted from <code>string</code>
 * @param  {String}           string   The <em>uri</em> string
 * @param  {URINameComponent} [target] The target instance
 * @return {URINameComponent}
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>target</code> is not a <code>URINameComponent</code> instance or <code>undefined</code>
 */
URINameComponent.URIString = function(string, target) {
	if (target === undefined) target = new URINameComponent();
	else if (!(target instanceof URINameComponent)) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	
	return URIComponent.URIString(string, target.type, target);
};

/**
 * Returns a instance represented by <code>string</code>
 * @param  {String}           string                                The <em>component</em> string
 * @param  {Int}              [flags=URINameComponent#NAME_FORWARD] The flags
 * @param  {URINameComponent} [target]                              The target instance
 * @return {URINameComponent}
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>flags</code> is not a <code>Int</code> or <code>undefined</code>
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>target</code> is not a <code>URINameComponent</code> instance or <code>undefined</code>
 */
URINameComponent.ComponentString = function(string, flags, target) {
	if (flags !== undefined && (typeof flags != 'number' || flags << 0 != flags)) throw new TypeError(URIComponent.ERROR_ARGUMENT); 
	
	if (target === undefined) target = new URINameComponent();
	else if (!(target instanceof URINameComponent)) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	else target.define();
	
	flags = flags || target.NAME_FORWARD;
	
	if (flags & target.NAME_REVERSE) target.stringReverse = string;
	else target.string = string;
	
	return target;
};

/**
 * Returns a instance represented by <code>segment</code>
 * @param  {String[]}         segment  The reverse notation <em>segment</em> array
 * @param  {URINameComponent} [target] The target instance
 * @return {URINameComponent}
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>target</code> is not a <code>URINameComponent</code> instance or <code>undefined</code>
 */
URINameComponent.Array = function(segment, target) {
	if (target === undefined) target = new URINameComponent();
	else if (!(target instanceof URINameComponent)) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	else target.define();
	
	target.segment = segment;
	
	return target;
};


/**
 * Returns a copy of <code>name</code>
 * @param  {URINameComponent} name The name component
 * @return {URINameComponent}
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>name</code> is not a <code>URINameComponent</code> instance
 */
URINameComponent.copy = function(name) {
	if (!name || name.constructor != URINameComponent) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	
	var res = new URINameComponent();
	
	res.chars = name.chars;
	
	return res;
};


/**
 * Returns a type-version string
 * @return {String}
 */
URINameComponent.toString = function() {
	return "[URINameComponent-" + URINameComponent.VERSION + "]";
};




/**
 * Creates a new instance
 * @class Uniform Resource Identifier path <em>component</em> manipulation
 * @extends URIComponent
 * @requires URIComponent
 * @author <a href="mail@christoph-kettelhoit.de">Christoph Kettelhoit</a>
 * @returns {URIPathComponent}
 */
function URIPathComponent() {
	this.antetype.constructor.call(this, this.TYPE_PATH);
}


URIPathComponent.prototype = new URIComponent(URIComponent.prototype.TYPE_PATH);


/**
 * The constructor
 * @type Function
 */
URIPathComponent.prototype.constructor = URIPathComponent;


/**
 * The prototype of the ancestor
 * @type Object
 */
URIPathComponent.prototype.antetype = URIComponent.prototype;


/**
 * (Re)defines the instance
 * @return {void}
 */
URIPathComponent.prototype.define = function() {
	this.antetype.constructor.call(this, this.TYPE_PATH);
};


/**
 * The resolved path string representation
 * <p>[readonly]</p>
 * @name stringResolved
 * @memberOf URIPathComponent#
 * @type String
 */
Object.defineProperty(URIPathComponent.prototype, 'stringResolved', {
	get : function() {
		var segment = this.string.split("/"), last = segment.length - 1;
		var resolve = [], n = 0;
		
		for (var i = 0, s = segment[0]; s != null; s = segment[++i]) {
			switch (s) {
				case "." :
					if (!i || i == last) resolve.push(s);
					
					continue;
				case ".." :
					if (n && i != last) {
						resolve.pop();
						n--;
					} else resolve.push(s);
					
					continue;
				case "" :
					resolve.push(s);
					
					if (i) n++;
					
					continue;
				default : 
					resolve.push(s);
					n++;
			}
		}
		
		return resolve.join("/");
	},
	configurable : true,
	enumerable : true
});

/**
 * A <em>segment</em> array copy
 * <p>First element will be a empty <code>String</code> if path is absolute, last element will be a empty <code>String</code> if path is ending in a slash.</p>
 * @name segment
 * @memberOf URIPathComponent#
 * @type String[]
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if the set argument is not a nonempty <code>Array</code> of <code>String</code>s
 */
Object.defineProperty(URIPathComponent.prototype, 'segment', {
	get : function() {
		return this.string.split("/");
	},
	set : function(segment) {
		if (!segment || segment.constructor != Array || !segment.length) throw new TypeError(URIComponent.ERROR_ARGUMENT);
		
		var string = "";
		
		for (var i = 0, l = segment.length; i < l; i++) {
			if (typeof segment[i] != 'string') throw new TypeError(URIComponent.ERROR_ARGUMENT);
			
			string += segment[i] + "/";
		}
		
		this.chars = string.substring(0, string.length - 1);
	},
	configurable : true,
	enumerable : true
});


/**
 * <code>true</code> if the path is absolute, <code>false</code> otherwise
 * @name absolute
 * @memberOf URIPathComponent#
 * @type Boolean
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if the set argument is not a <code>Boolean</code>
 */
Object.defineProperty(URIPathComponent.prototype, 'absolute', {
	get : function() {
		return this.chars[0] == "/" ? true : false;
	},
	set : function(absolute) {
		if (typeof absolute != 'boolean') throw new TypeError(URIComponent.ERROR_ARGUMENT);
		
		if (absolute) {
			if (this.chars[0] != "/") this.chars = "/" + this.chars;
			
			return;
		}
		
		if (this.chars[0] == "/") this.chars = this.chars.substring(1);
	},
	configurable : true,
	enumerable : true
});

/**
 * The last path segment
 * @name lastSegment
 * @memberOf URIPathComponent#
 * @type String
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if the set argument is not a valid path <em>segment</em> <code>String</code>
 */
Object.defineProperty(URIPathComponent.prototype, 'lastSegment', {
	get : function() {
		var s = this.string;
		var i = s.lastIndexOf("/");
		
		if (i == -1) return s;
		
		return s.substring(i + 1);
	},
	set : function(string) {
		if (typeof string != 'string' || string.search(URIComponent.PATH_SEGMENT) == -1) throw new TypeError(URIComponent.ERROR_ARGUMENT);
		
		var s = this.string;
		var i = s.lastIndexOf("/");
		
		if (i == -1) this.chars = string;
		
		this.chars = s.substring(0, i + 1) + string;
	},
	configurable : true,
	enumerable : true
});


/**
 * Resolves local path segment references
 * @return {void}
 */
URIPathComponent.prototype.resolve = function() {
	this.chars = this.stringResolved;
};



/**
 * The version string
 * @static
 * @constant
 * @name VERSION
 * @memberOf URIPathComponent
 * @type String
 */
Object.defineProperty(URIPathComponent, 'VERSION', {value : "0.1.2"});


/**
 * Returns a instance extracted from <code>string</code>
 * @param  {String}           string   The <em>uri</em> string
 * @param  {URIPathComponent} [target] The target instance
 * @return {URIPathComponent}
 * @throws {TypeError} <code>{@link URIPathComponent.ERROR_ARGUMENT}</code> if <code>target</code> is not a <code>URIPathComponent</code> instance or <code>undefined</code>
 */
URIPathComponent.URIString = function(string, target) {
	if (target === undefined) target = new URIPathComponent();
	else if (!(target instanceof URIPathComponent)) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	
	return URIComponent.URIString(string, target.type, target);
};

/**
 * Returns a instance represented by <code>string</code>
 * @param  {String}           string   The <em>component</em> string
 * @param  {URIPathComponent} [target] The target instance
 * @return {URIPathComponent}
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>target</code> is not a <code>URIPathComponent</code> instance or <code>undefined</code>
 */
URIPathComponent.ComponentString = function(string, target) {
	if (target === undefined) target = new URIPathComponent();
	else if (!(target instanceof URIPathComponent)) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	
	return URIComponent.ComponentString(string, target.type, target);
};

/**
 * Returns a instance represented by <code>segment</code>
 * @param  {String[]}         segment  The <em>segment</em> array
 * @param  {URIPathComponent} [target] The target instance
 * @return {URIPathComponent}
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>target</code> is not a <code>URIPathComponent</code> instance or <code>undefined</code>
 */
URIPathComponent.Array = function(segment, target) {
	if (target === undefined) target = new URIPathComponent();
	else if (!(target instanceof URIPathComponent)) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	else target.define();
	
	target.segment = segment;
	
	return target;
};


/**
 * Returns a copy of <code>path</code>
 * @param  {URIPathComponent} path The path component
 * @return {URIPathComponent}
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>path</code> is not a <code>URIPathComponent</code> instance
 */
URIPathComponent.copy = function(path) {
	if (!path || path.constructor != URIPathComponent) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	
	var res = new URIPathComponent();
	
	res.chars = path.chars;
	
	return res;
};


/**
 * Returns a type-version string
 * @return {String}
 */
URIPathComponent.toString = function() {
	return "[URIPathComponent-" + URIPathComponent.VERSION + "]";
};




/**
 * Creates a new instance
 * @class Uniform Resource Identifier key/value(s) string manipulation
 * @requires URIComponent
 * @author <a href="mail@christoph-kettelhoit.de">Christoph Kettelhoit</a>
 * @param  {Char} [keyLimit="&"]   The key delimiter
 * @param  {Char} [valueLimit="="] The key/value delimiter
 * @param  {Char} [listLimit=","]  The value list seperator
 * @return {URIKeyValue}
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>keyLimit</code> is not a <code>Char</code> or <code>null</code>
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>valLimit</code> is not a <code>Char</code> or <code>null</code>
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>lstLimit</code> is not a <code>Char</code> or <code>null</code>
 */
function URIKeyValue(keyLimit, valueLimit, listLimit) {	
	if (keyLimit != null && (typeof keyLimit != 'string' || keyLimit.length != 1) || valueLimit != null && (typeof valueLimit != 'string' || valueLimit.length != 1) || listLimit != null && (typeof listLimit != 'string' || listLimit.length != 1)) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	
	/**
	 * The key delimiter
	 * <p>[readonly]</p>
	 * @name keyLimit
	 * @memberOf URIKeyValue
	 * @type Char
	 */
	Object.defineProperty(this, 'keyLimit', {
		value : keyLimit || URIKeyValue.DELIMITER_DEFAULT_KEY,
		configurable : true,
		enumerable : true
	});
	/**
	 * The key/value delimiter
	 * <p>[readonly]</p>
	 * @name valueLimit
	 * @memberOf URIKeyValue
	 * @type Char
	 */
	Object.defineProperty(this, 'valueLimit', {
		value : valueLimit || URIKeyValue.DELIMITER_DEFAULT_VALUE,
		configurable : true,
		enumerable : true
	});
	/**
	 * The value list seperator
	 * <p>[readonly]</p>
	 * @name listLimit
	 * @memberOf URIKeyValue
	 * @type Char
	 */
	Object.defineProperty(this, 'listLimit', {
		value : listLimit || URIKeyValue.SEPERATOR_DEFAULT_VALUE,
		configurable : true,
		enumerable : true
	});
	
	/**
	 * The token regular expression
	 * <p>[immutable]</p>
	 * @name tokenExpression
	 * @memberOf URIKeyValue
	 * @type RegExp
	 */
	Object.defineProperty(this, 'tokenExpression', {
		value : new RegExp("^[^\\" + this.keyLimit + "\\" + this.valueLimit + "\\" + this.listLimit + "]+$"),
		configurable : true,
		enumerable : true
	})
	
	/**
	 * <code>Array</code> of keys
	 * @type String[]
	 */
	this.key = [];
	/**
	 * <em>Dictionary</em> of value string <code>Array</code>s
	 * @type Array{}
	 */
	this.value = {};
}


/**
 * (Re)defines the instance
 * @param  {Char} [keyLimit="&"]   The key delimiter
 * @param  {Char} [valueLimit="="] The key/value delimiter
 * @param  {Char} [listLimit=","]  The value list seperator
 * @return {void}
 */
URIKeyValue.prototype.define = function(keyLimit, valueLimit, listLimit) {
	URIKeyValue.call(this, keyLimit, valueLimit, listLimit);
};


/**
 * The string representation
 * @name string
 * @memberOf URIKeyValue#
 * @type String
 * @throws {Error} <code>{@link URIComponent.ERROR_MALFORMED}</code> if getting a malformed <em>component</em> string
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if the set argument is not a nonempty <code>String</code>
 * @throws {Error} <code>{@link URIComponent.ERROR_MALFORMED}</code> if setting a malformed <em>component</em> string
 */
Object.defineProperty(URIKeyValue.prototype, 'string', {
	get : function() {
		var index = [], dict = {}, string = "";
		
		for (var i = 0, key = this.key[0]; key; key = this.key[++i]) {
			if (dict[key] != null) throw new Error(URIComponent.ERROR_MALFORMED);
			
			index.push(key);
			dict[key] = i;
		}
		
		for (key in this.value) {
			if (dict[key] == null) index.push(key);
		}
		
		for (i = 0, key = index[0]; key; key = index[++i]) {
			if (typeof key != 'string' || key.search(this.tokenExpression) == -1) throw new Error(URIComponent.ERROR_MALFORMED);
			
			string += key;
			
			if (this.value[key]) {
				if (this.value[key].constructor != Array) throw new Error(URIComponent.ERROR_MALFORMED);
				
				if (!this.value[key].length) {
					string += this.keyLimit;
					continue;
				}
				
				string += this.valueLimit;
				
				for (var j = 0, val = this.value[key][0]; val; val = this.value[key][++j]) {
					if (typeof val != 'string' || val.search(this.tokenExpression) == -1) throw new Error(URIComponent.ERROR_MALFORMED);
					
					string += val + this.listLimit;
				}
				
				string = string.substring(0, string.length - 1);
			}
			
			string += this.keyLimit;
		}		
		
		return string.substring(0, string.length - 1);		
	},
	set : function(string) {
		if (typeof string != 'string') throw new TypeError(URIComponent.ERROR_ARGUMENT);
		
		var segment = string.split(this.keyLimit);
		var index = [], value = {}, dict = {};
		
		for (var i = 0, seg = segment[0]; seg; seg = segment[++i]) {
			var pair = seg.split(this.valueLimit);
			var key = pair[0], val = null;
			
			if (pair.length == 2) val = pair[1].split(this.listLimit);
			else if (pair.length > 2) throw new Error(URIComponent.ERROR_MALFORMED);
						
			if (dict[key] != null) throw new Error(URIComponent.ERROR_MALFORMED);
			
			index.push(key);
			dict[key] = i;
			
			if (val) value[key] = val;
		}
		
		this.key = index;
		this.value = value;
	},
	configurable : true,
	enumerable : true
});


/**
 * <code>true</code> if the instance is a valid key/value <em>component</em>, <code>false</code> otherwise
 * <p>[readonly]</p>
 * @name valid
 * @memberOf URIKeyValue#
 * @type Boolean
 */
Object.defineProperty(URIKeyValue.prototype, 'valid', {
	get : function() {		
		for (var i = 0, key = this.key[0]; key; key = this.key[++i]) {
			if (typeof key != 'string' || key.search(this.tokenExpression) == -1) return false;
		}
		
		for (key in this.value) {
			if (key.search(this.tokenExpression) == -1 || this.value[key].constructor != Array) return false;
			
			for (var j = 0, val = this.value[key][0]; val; val = this.value[key][++j]) {
				if (typeof val != 'string' || val.search(this.tokenExpression) == -1) return false;
			}
		}
		
		return true;
	},
	configurable : true,
	enumerable : true
});



/**
 * Inserts a ordered key
 * <p>If <code>key</code> already is a ordered key, it will be repositioned.</p>
 * @param  {String}   key       The key
 * @param  {String[]} [value]   <code>Array</code> of values
 * @param  {UInt}     [index=0] The insertion index
 * @return {void}
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>key</code> is not a valid <code>String</code>
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>value</code> is not a <code>Array</code> of valid <code>String</code>s or <code>null</code>
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>index</code> is not a bounded <code>UInt</code> or <code>null</code>
 */
URIKeyValue.prototype.insertKey = function(key, value, index) {
	if (!key || typeof key != 'string' || key.search(this.tokenExpression) == -1 || value != null && value.constructor != Array || index != null && (typeof index != 'number' || index < 0 || index > this.key.length || index << 0 != index)) throw new Error(URIComponent.ERROR_ARGUMENT);
	
	value = value || [];
	index = index || 0;
	
	for (var i = 0, val = value[0]; val; val = value[++i]) {
		if (typeof val != 'string' || val.search(this.tokenExpression)) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	}
	
	var j = this.key.indexOf(key);
	
	if (j != -1) {
		this.key.splice(j, 1);
		index--;
	}
	
	this.key.splice(index, 0, key);
	
	if (i) this.value[key] = value;
};

/**
 * Appends a ordered key
 * <p>Alias of <code>{@link URIKeyValue#insertKey}</code></p>
 * @param  {String}   key   The key
 * @param  {String[]} value <code>Array</code> of values
 * @return {void}
 */
URIKeyValue.prototype.appendKey = function(key, value) {
	this.inserKey(key, value, this.key.length);
};


/**
 * Sets <code>key</code> to <code>value</code>
 * @param  {String}   key The key
 * @param  {String[]} value <code>Array</code> of values
 * @return {void}
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>key</code> is not a valid <code>String</code>
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>value</code> is not a <code>Array</code> of valid <code>String</code>s
 */
URIKeyValue.prototype.setKey = function(key, value) {
	if (!key || typeof key != 'string' || key.search(this.tokenExpression) == -1 || !value || value.constructor != Array) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	
	for (var i = 0, val = value[0]; val; val = value[++i]) {
		if (typeof val != 'string' || val.search(this.tokenExpression) == -1) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	}
	
	this.value[key] = value;
};

/**
 * Return the value(s) of <code>key</code> if set, <code>null</code> otherwise
 * @param  {String}   key The key
 * @return {String[]}
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>key</code> is not a valid <code>String</code>
 */
URIKeyValue.prototype.getKey = function(key) {
	if (!key || typeof key != 'string' || key.search(this.tokenExpression) == -1) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	
	return this.value[key] || null;
};


/**
 * Removes a key
 * @param  {String} key The key
 * @return {void}
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>key</code> is not a valid <code>String</code>
 */
URIKeyValue.prototype.removeKey = function(key) {
	if (!key || typeof key != 'string' || key.search(this.tokenExpression) == -1) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	
	var index = this.key.indexOf(key);
	
	if (index != -1) this.key.splice(index, 1);
	
	if (this.value[key]) delete this.value[key];
};


/**
 * The copy of <code>source</code>
 * @param  {URIKeyValue} source The source
 * @return {void}
 * @throws <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>source</code> is not a <code>URIKeyValue</code> instance
 * @throws <code>{@link URIComponent.ERROR_MALFORMED}</code> if <code>source.value</code> is not a <em>Dictionary</em> of <code>Array</code>s
 */
URIKeyValue.prototype.copy = function(source) {
	if (!source || source.constructor != URIKeyValue) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	
	URIKeyValue.call(this, source.keyLimit, source.valueLimit, source.listLimit);
	
	this.key = source.key.slice(0);
	this.value = {};
	
	for (var key in source.value) {
		if (source.value[key].constructor != Array) throw new Error(URIComponent.ERROR_MALFORMED);
		
		this.value[key] = source.value[key].slice(0);
	}
};


/**
 * Returns a string representation of the <em>component</em>
 * <p>Alias of <code>{@link URIKeyValue#string}</code></p>
 * @return {String}
 */
URIKeyValue.prototype.toString = function() {
	return this.string;
};



/**
 * The version string
 * @static
 * @constant
 * @name VERSION
 * @memberOf URIKeyValue
 * @type String
 */
Object.defineProperty(URIKeyValue, 'VERSION', {value : "0.0.1"});

/**
 * The key delimiter character
 * @static
 * @constant
 * @name DELIMTER_DEFAULT_KEY
 * @memberOf URIKeyValue
 * @type Char
 */
Object.defineProperty(URIKeyValue, 'DELIMITER_DEFAULT_KEY',   {value : "&"});
/**
 * The key/value delimter character
 * @static
 * @constant
 * @name DELIMTER_DEFAULT_VALUE
 * @memberOf URIKeyValue
 * @type Char
 */
Object.defineProperty(URIKeyValue, 'DELIMITER_DEFAULT_VALUE', {value : "="});
/**
 * The value list seperator
 * @static
 * @constant
 * @name SEPERATOR_DEFAULT_VALUE
 * @memberOf URIKeyValue
 * @type Char
 */
Object.defineProperty(URIKeyValue, 'SEPERATOR_DEFAULT_VALUE', {value : ","});


/**
 * Returns a instance created from <code>string</code>
 * @static
 * @param  {String}      string       The <em>component</em> string
 * @param  {Char}        [keyLimit]   The key delimiter
 * @param  {Char}        [valueLimit] The value delimiter
 * @param  {Char}        [listLimit]  The value list seperator
 * @param  {URIKeyValue} [target]     The target instance
 * @return {URIKeyValue}
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>target</code> is not a <code>URIKeyValue</code> instance or <code>null</code>
 */
URIKeyValue.String = function(string, keyLimit, valueLimit, listLimit, target) {	
	if (!target) target = new URIKeyValue(keyLimit, valueLimit, listLimit);
	else if (target.constructor != URIKeyValue) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	else target.define(keyLimit || target.keyLimit, valueLimit || target.valueLimit, listLimit || target.listLimit);
	
	target.string = string;
	
	return target;
};

/**
 * Returns a instance created from <code>index</code> and <code>key</code>
 * @static
 * @param  {String[]}    key          <code>Array</code> of keys
 * @param  {Array{}}     value        <em>Dictionary</em> of value string <code>Array</code>s
 * @param  {Char}        [keyLimit]   The key delimiter
 * @param  {Char}        [valueLimit] The value delimiter
 * @param  {Char}        [listLimit]  The value list seperator
 * @param  {URIKeyValue} [target]     The target instance
 * @return {URIKeyValue}
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>key</code> is not a <code>Array</code> of valid <code>String</code>s
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>value</code> is not a <em>Dictionary</em> of <code>Array</code>s of valid <code>String</code>s
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>target</code> is not a <code>URIKeyValue</code> instance or <code>null</code>
 */
URIKeyValue.Key = function(key, value, keyLimit, valueLimit, listLimit, target) {
	if (!key || key.constructor != Array || !value || value.constructor != Object) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	
	if (!target) target = new URIKeyValue(keyLimit, valueLimit, listLimit);
	else if (target.constructor != URIKeyValue) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	else target.define(keyLimit || target.keyLimit, valueLimit || target.valueLimit, listLimit || target.listLimit);
	
	var dict = {};
	
	for (var i = 0, s = key[0]; s; s = key[++i]) {
		if (typeof s != 'string' || dict[s] != null || s.search(target.tokenExpression) == -1) throw new TypeError(URIComponent.ERROR_ARGUMENT);
		
		dict[s] = i;
	}
	
	for (s in value) {
		if (s.search(target.tokenExpression) == -1 || value[s].constructor != Array) throw new TypeError(URIComponent.ERROR_ARGUMENT);
		
		for (var j = 0, t = value[s][0]; t; t = value[s][++j]) {
			if (typeof t != 'string' || t.search(target.tokenExpression) == -1) throw new TypeError(URIComponent.ERROR_ARGUMENT);
		}
	}
	
	target.key = key;
	target.value = value;
};


/**
 * Returns a copy of <code>source</code>
 * <p>Alias of <code>{@link URIKeyValue#copy}</code></p>
 * @static
 * @param  {URIKeyValue} source The source
 * @return {URIKeyValue}
 */
URIKeyValue.copy = function(source) {
	var res = new URIKeyValue();
	
	res.copy(source);
	
	return res;
};


/**
 * Returns a type-version string
 * @static
 * @return {String}
 */
URIKeyValue.toString = function() {
	return "[URIKeyValue-" + URIKeyValue.VERSION + "]";
}