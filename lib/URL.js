/**
 * Creates a new Instance
 * @class Uniform Resource Identifier <em>component</em> manipulation
 * @author <a href="mailto:mail@christoph-kettelhoit.de">Christoph Kettelhoit</a>
 * @param  {Int} type The component type
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
 * @return {void}
 */
URIComponent.prototype.define = function() {
	this.constructor.call(this);
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
	if (!component || component.constructor != URIComponent) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	
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
Object.defineProperty(URIComponent, 'VERSION', {value : "0.1.1"});

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

	if (!target) target = new URIComponent(type);
	else if (target.constructor != URIComponent) throw new TypeError(URIComponent.ERROR_ARGUMENT);
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
		
	if (!target) target = new URIComponent(type);
	else if (target.constructor != URIComponent) throw new TypeError(URIComponent.ERROR_ARGUMENT);
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