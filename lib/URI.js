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
		
		this.string = string.substring(0, string.length - 1);
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