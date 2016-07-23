/**
 * Creates a new Instance
 * @class Uniform Resource Identifier <em>component</em> manipulation
 * @author <a href="mailto:mail@christoph-kettelhoit.de">Christoph Kettelhoit</a>
 * @param  {Int} type The component type
 * @returns {URIComponent}
 * @throws {TypeError} if <code>type</code> is not a valid <em>component</em> type
 * @license Licensed under the LGPL 3 (http://www.gnu.org/licenses/lgpl.html) 
 */
function URIComponent(type) {
	var cmp, uri, trn;
	
	switch(type) {
		case this.TYPE_SCHEME :
			cmp = URIComponent.SCHEME;
			uri = URIComponent.SCHEME_URI;
			trn = URIComponent.TRANSFORM_U;
			break;
		case this.TYPE_USER :
			cmp = URIComponent.USER;
			uri = URIComponent.USER_URI;
			trn = URIComponent.TRANSFORM_E;
			break;
		case this.TYPE_NAME :
			cmp = URIComponent.NAME;
			uri = URIComponent.NAME_URI;
			trn = URIComponent.TRANSFORM_UE;
			break;
		case this.TYPE_PORT :
			cmp = URIComponent.PORT;
			uri = URIComponent.PORT_URI;
			trn = URIComponent.TRANSFORM_0;
			break;
		case this.TYPE_PATH :
			cmp = URIComponent.PATH;
			uri = URIComponent.PATH_URI;
			trn = URIComponent.TRANSFORM_E;
			break;
		case this.TYPE_QUERY :
			cmp = URIComponent.QUERY;
			uri = URIComponent.QUERY_URI;
			trn = URIComponent.TRANSFORM_E;
			break;
		case this.TYPE_FRAGMENT :
			cmp = URIComponent.FRAGMENT;
			uri = URIComponent.FRAGMENT_URI;
			trn = URIComponent.TRANSFORM_E;
			break;
		default : throw new TypeError();
	}
	
	/**
	 * The character data
	 * @type String
	 */
	this.chars = "";
	
	/**
	 * The type
	 * @name type
	 * @memberOf URIComponent#
	 * @readonly
	 * @type Int
	 */
	Object.defineProperty(this, 'type', {
		value : type,
		configurable : true,
		enumerable : true
	});
	
	/**
	 * The <em>component</em> regular expression
	 * @name componentExpression
	 * @memberOf URIComponent#
	 * @readonly
	 * @type RegExp
	 */
	Object.defineProperty(this, 'componentExpression', {
		value : cmp,
		configurable : true,
		enumerable : true
	});
	/**
	 * The <em>uri</em> regular expression
	 * @name uriExpression
	 * @memberOf URIComponent#
	 * @readonly
	 * @type RegExp
	 */
	Object.defineProperty(this, 'uriExpression', {
		value : uri,
		configurable : true,
		enumerable : true
	});
	/**
	 * The <em>transform</em> regular expression
	 * @name transformExpression
	 * @memberOf URIComponent#
	 * @readonly
	 * @type RegExp
	 */
	Object.defineProperty(this, 'transformExpression', {
		value : trn,
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
Object.defineProperty(URIComponent.prototype, 'TYPE_SCHEME', {
	value : 0x01,
	enumerable : true
});
/**
 * The user <em>component</em> type
 * @constant
 * @name TYPE_USER
 * @memberOf URIComponent#
 * @type Int
 */
Object.defineProperty(URIComponent.prototype, 'TYPE_USER', {
	value : 0x02,
	enumerable : true
});
/**
 * The name <em>component</em> type
 * @constant
 * @name TYPE_NAME
 * @memberOf URIComponent#
 * @type Int
 */
Object.defineProperty(URIComponent.prototype, 'TYPE_NAME', {
	value : 0x04,
	enumerable : true
});
/**
 * The port <em>component</em> type
 * @constant
 * @name TYPE_PORT
 * @memberOf URIComponent#
 * @type Int
 */
Object.defineProperty(URIComponent.prototype, 'TYPE_PORT', {
	value : 0x08,
	enumerable : true
});
/**
 * The path <em>component</em> type
 * @constant
 * @name TYPE_PATH
 * @memberOf URIComponent#
 * @type Int
 */
Object.defineProperty(URIComponent.prototype, 'TYPE_PATH', {
	value : 0x10,
	enumerable : true
});
/**
 * The query <em>component</em> type
 * @constant
 * @name TYPE_QUERY
 * @memberOf URIComponent#
 * @type Int
 */
Object.defineProperty(URIComponent.prototype, 'TYPE_QUERY', {
	value : 0x20,
	enumerable : true
});
/**
 * The fragment <em>component</em> type
 * @constant
 * @name TYPE_FRAGMENT
 * @memberOf URIComponent#
 * @type Int
 */
Object.defineProperty(URIComponent.prototype, 'TYPE_FRAGMENT', {
	value : 0x40,
	enumerable : true
});


/**
 * The constructor
 * @type Function
 */
URIComponent.prototype.constructor = URIComponent;


/**
 * (Re)defines the instance
 * @param {Int} type The component type
 * @returns {undefined}
 */
URIComponent.prototype.define = function(type) {
	this.constructor.call(this, type);
};


/**
 * The string representation
 * @name string
 * @memberOf URIComponent#
 * @type String
 * @throws {URIError}  if getting an invalid <em>component</em>
 * @throws {TypeError} if not setting a <code>String</code>
 * @throws {URIError}  if setting an invalid <em>component</em>
 */
Object.defineProperty(URIComponent.prototype, 'string', {
	get : function() {
		if (this.chars.search(this.componentExpression) === -1) throw new URIError();
		
		return this.chars;
	},
	set : function(string) {
		if (typeof string !== 'string') throw new TypeError();

		if (string !== "" && string.search(this.componentExpression) === -1) {
			string = string.replace(this.transformExpression, function(match) {
				if (match.charAt(0) === "%") return match.toUpperCase();
				else return match.toLowerCase();
			});
			
			if (string.search(this.componentExpression) === -1) throw new URIError();
		}

		this.chars = string;
	},
	configurable : true,
	enumerable : true
});


/**
 * <code>true</code> if the instance is empty, <code>false</code> otherwise
 * @name empty
 * @memberOf URIComponent#
 * @readonly
 * @type Boolean
 */
Object.defineProperty(URIComponent.prototype, 'empty', {
	get : function() {
		return !this.chars.length;
	},
	configurable : true,
	enumerable : true
});

/**
 * <code>true</code> if the instance is a valid <em>component</em>, <code>false</code> otherwise
 * @name valid
 * @memberOf URIComponent#
 * @readonly
 * @type Boolean
 */
Object.defineProperty(URIComponent.prototype, 'valid', {
	get : function() {
		return this.chars.search(this.componentExpression) !== -1;
	},
	configurable : true,
	enumerable : true
});


/**
 * The copy of <code>component</code>
 * @param {URIComponent} component The component
 * @returns {undefined}
 * @throws {TypeError} if <code>component</code> is not a <code>URIComponent</code> instance
 */
URIComponent.prototype.copyOf = function(component) {
	if (!(component instanceof URIComponent)) throw new TypeError();
	
	this.constructor.call(this, component.type);
	
	this.chars = component.chars;
};


/**
 * Returns a string representation of the <em>component</em>
 * @returns {String}
 */
URIComponent.prototype.toString = function() {
	return this.string;
};



/**
 * The version string
 * @constant
 * @name VERSION
 * @memberOf URIComponent
 * @type String
 */
Object.defineProperty(URIComponent, 'VERSION', {value : "0.2.0"});

/**
 * The scheme <em>component</em> regular expression
 * @constant
 * @name SCHEME
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'SCHEME', {
	value : /^[a-z][0-9a-z\+\-\.]*$/,
	enumerable : true
});
/**
 * The scheme <em>uri</em> regular expression
 * @constant
 * @name SCHEME_URI
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'SCHEME_URI', {
	value : /^([A-Za-z][0-9A-Za-z\+\-\.]*)\:/,
	enumerable : true
});
/**
 * The user <em>component</em> regular expression
 * @constant
 * @name USER
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'USER', {
	value : /^([\!\$&'\(\)\*\+\,\-\.0-9\:;\=A-Z_a-z~]|%[0-9A-F]{2})+$/,
	enumerable : true
});
/**
 * The user <em>uri</em> regular expression
 * @constant
 * @name USER_URI
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'USER_URI', {
	value : /^(?:[^\/]*\:)?\/{2}(([\!\$&'\(\)\*\+\,\-\.0-9\:;\=A-Z_a-z~]|%[0-9A-Fa-f]{2})*)(?:@[^\/]+)/,
	enumerable : true
});
/**
 * The name <em>component</em> regular expression
 * @constant
 * @name NAME
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'NAME', {
	value : /^([0-9a-z\-\.]|%[0-9A-F]{2})+$/,
	enumerable : true
});
/**
 * The name <em>segment</em> regular expression
 * @constant
 * @name NAME_SEGMENT
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'NAME_SEGMENT', {
	value : /^([0-9a-z\-]|%[0-9A-F]{2})+$/,
	enumerable : true
});
/**
 * The name <em>uri</em> regular expression
 * @constant
 * @name NAME_URI
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'NAME_URI', {
	value : /^(?:[^\/]*\:)?\/{2}(?:[^\/]*@)?((?:[0-9A-Za-z\-\.]|%[0-9A-Fa-f]{2})*)(?:\:[^@]*\/|\/|\?|#|$)/,
	enumerable : true
});
/**
 * The port <em>component</em> regular expression
 * @constant
 * @name PORT
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'PORT', {
	value : /^\d+$/,
	enumerable : true
});
/**
 * The port <em>uri</em> regular expression
 * @constant
 * @name PORT_URI
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'PORT_URI', {
	value : /^(?:[^\/]*\:)?\/{2}[^\/]*\:(\d*)(?:\/|\?|#|$)/,
	enumerable : true
});
/**
 * The path <em>component</em> regular expression
 * @constant
 * @name PATH
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'PATH', {
	value : /^([0-9A-Za-z\!\$&'\(\)\*\+,\-\.\/\:;\=@_~]|%[0-9A-F]{2})+$/,
	enumerable : true
});
/**
 * The path <em>segment</em> regular expression
 * @constant
 * @name PATH_SEGMENT
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'PATH_SEGMENT', {
	value : /^([0-9A-Za-z\!\$&'\(\)\*\+,\-\.\/\:;\=@_~]|%[0-9A-F]{2})*$/,
	enumerable : true
});
/**
 * The path <em>uri</em> regular expression
 * @constant
 * @name PATH_URI
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'PATH_URI', {
	value : /^(?:(?:(?:[^\/]+\:)?\/{2}[^\/\?#]*)|(?:[^\/\:]+\:)|(?=[^\:]))((?:[\!\$\&'\(\)\*\+\,\-\.\/0-9\:;\=@A-Z_a-z~]|%[0-9A-Fa-f]{2})*)(?:\?|#|$)/,
	enumerable : true
});
/**
 * The query <em>component</em> regular expression
 * @constant
 * @name QUERY
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'QUERY', {
	value : /^([\!\$\&'\(\)\*\+\,\-\.\/0-9\:;\=\?@A-Z_a-z~]|%[0-9A-F]{2})+$/,
	enumerable : true
});
/**
 * The query <em>uri</em> regular expression
 * @constant
 * @name QUERY_URI
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'QUERY_URI', {
	value : /(?:[^\?]*\?)((?:[\!\$\&'\(\)\*\+\,\-\.\/0-9\:;\=\?@A-Z_a-z~]|%[0-9A-Fa-f]{2})*)(?:#|$)/,
	enumerable : true
});
/**
 * The fragment <em>component</em> regular expression
 * @constant
 * @name FRAGMENT
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'FRAGMENT', {
	value : /^([\!\$\&'\(\)\*\+\,\-\.\/0-9\:;\=\?@A-Z_a-z~]|%[0-9A-F]{2})+$/,
	enumerable : true
});
/**
 * The fragment <em>uri</em> regular expression
 * @constant
 * @name FRAGMENT_URI
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'FRAGMENT_URI', {
	value : /^(?:[^#]*#)((?:[\!\$\&'\(\)\*\+\,\-\.\/0-9\:;\=\?@A-Z_a-z~]|%[0-9A-Fa-f]{2})*)$/,
	enumerable : true
});

/**
 * The transform nothing regular expression
 * @constant
 * @name TRANSFORM_0
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'TRANSFORM_0', {
	value: /$^/,
	enumerable: true
});
/**
 * The transform entities regular expression
 * @constant
 * @name TRANSFORM_E
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'TRANSFORM_E', {
	value: /%[0-9A-Fa-f]{2}/g,
	enumerable: true
});
/**
 * The transform uppercase regular expression
 * @constant
 * @name TRANSFORM_U
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'TRANSFORM_U', {
	value: /[A-Z]+/g,
	enumerable: true
});
/**
 * The transform uppercase and entities regular expression
 * @constant
 * @name TRANSFORM_UE
 * @memberOf URIComponent
 * @type RegExp
 */
Object.defineProperty(URIComponent, 'TRANSFORM_UE', {
	value: /%[0-9A-Fa-f]{2}|[A-Z]+/g,
	enumerable: true
});


/**
 * Returns a instance of <em>component</em> <code>type</code> extracted from <code>string</code>
 * @param {String}        string  The <em>uri</em> string
 * @param {Int}           type    The <em>component</em> type
 * @param {URIComponent} [target] The target instance
 * @returns {URIComponent}
 * @throws {TypeError} if <code>string</code> is not a <code>String</code>
 * @throws {TypeError} if <code>target</code> is not a <code>URIComponent</code> instance or <code>undefined</code>
 */
URIComponent.URIString = function(string, type, target) {
	if (typeof string !== 'string') throw new TypeError();

	if (target === undefined) target = new URIComponent(type);
	else if (!(target instanceof URIComponent)) throw new TypeError();
	else URIComponent.call(target, type);
	
	var match = string.match(target.uriExpression);
	
	if (match) target.string = match[1];
	
	return target;
};

/**
 * Returns a instance of <em>component</em> <code>type</code> represented by <code>string</code>
 * @param {String}        string  The <em>component</em> string
 * @param {Int}           type    The <em>component</em> type
 * @returns {URIComponent}
 */
URIComponent.ComponentString = function(string, type) {
	var res = new URIComponent(type);
	
	res.string = string;
	
	return res;
};


/**
 * Returns a copy of <code>component</code>
 * @param {URIComponent} component The component
 * @returns {URIComponent}
 * @throws {TypeError} if <code>component</code> is not a <code>URIComponent</code> instance
 */
URIComponent.copy = function(component) {
	if (!(component instanceof URIComponent)) throw new TypeError();
	
	var res = new URIComponent(component.type);
	
	res.chars = component.chars;
	
	return res;
};


/**
 * Returns <code>true</code> if <code>a</code> and <code>b</code> are equal, <code>false</code> otherwise
 * @param {URIComponent} a The protagonist
 * @param {URIComponent} b The antagonist
 * @returns {Boolean}
 * @throws {TypeError} if <code>a</code> is not a <code>URIComponent</code> instance
 * @throws {TypeError} if <code>b</code> is not a <code>URIComponent</code> instance
 */
URIComponent.isEQ = function(a, b) {
	if (!(a instanceof URIComponent) || !(b instanceof URIComponent)) throw new TypeError();
	
	return a.type === b.type && a.chars === b.chars;
};


/**
 * Returns a type-version string
 * @return {String}
 */
URIComponent.toString = function() {
	return "[URIComponent-" + URIComponent.VERSION + "]";
};