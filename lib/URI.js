/**
 * Creates a new Instance
 * @class Uniform Resource Identifier manipulation
 * @requires URIComponent
 * @author <a href="mail@christoph-kettelhoit.de">Christoph Kettelhoit</a>
 * @returns {URI}
 * @license Licensed under the LGPL 3 (http://www.gnu.org/licenses/lgpl.html)
 */
function URI() {
	/**
	 * The scheme component
	 * <p>[immutable]</p>
	 * @name scheme
	 * @memberOf URI#
	 * @type URIComponent
	 */
	Object.defineProperty(this, 'scheme', {
		value : new URIComponent(URIComponent.prototype.TYPE_SCHEME),
		configurable : true,
		enumerable : true
	});
	/**
	 * The user component
	 * <p>[immutable]</p>
	 * @name user
	 * @memberOf URI#
	 * @type URIComponent
	 */
	Object.defineProperty(this, 'user', {
		value : new URIComponent(URIComponent.prototype.TYPE_USER),
		configurable : true,
		enumerable : true
	});
	/**
	 * The name component
	 * <p>[immutable]</p>
	 * @name name
	 * @memberOf URI#
	 * @type URIComponent
	 */
	Object.defineProperty(this, 'name', {
		value : new URIComponent(URIComponent.prototype.TYPE_NAME),
		configurable : true,
		enumerable : true
	});
	/**
	 * The port component
	 * <p>[immutable]</p>
	 * @name port
	 * @memberOf URI#
	 * @type URIComponent
	 */
	Object.defineProperty(this, 'port', {
		value : new URIComponent(URIComponent.prototype.TYPE_PORT),
		configurable : true,
		enumerable : true
	});
	/**
	 * The path component
	 * <p>[immutable]</p>
	 * @name path
	 * @memberOf URI#
	 * @type URIComponent
	 */
	Object.defineProperty(this, 'path', {
		value : new URIComponent(URIComponent.prototype.TYPE_PATH),
		configurable : true,
		enumerable : true
	});
	/**
	 * The query component
	 * <p>[immutable]</p>
	 * @name query
	 * @memberOf URI#
	 * @type URIComponent
	 */
	Object.defineProperty(this, 'query', {
		value : new URIComponent(URIComponent.prototype.TYPE_QUERY),
		configurable : true,
		enumerable : true
	});
	/**
	 * The fragment component
	 * <p>[immutable]</p>
	 * @name fragment
	 * @memberOf URI#
	 * @type URIComponent
	 */
	Object.defineProperty(this, 'fragment', {
		value : new URIComponent(URIComponent.prototype.TYPE_FRAGMENT),
		configurable : true,
		enumerable : true
	});
}


/**
 * The constructor
 * @type Function
 */
URI.prototype.constructor = URI;


/**
 * (Re)defines the instance
 * <p>Invoking <code>define</code> on a defined instance will <code>undefine</code> it beforehand.</p>
 * @returns {undefined}
 */
URI.prototype.define = function() {
	if (this.name !== null) this.undefine();
	
	URI.call(this);
};

/**
 * Undefines the instance
 * @returns {undefined}
 */
URI.prototype.undefine = function() {
	if (this.name !== null) return;
	
	Object.defineProperty(this, 'scheme',   {value : null});
	Object.defineProperty(this, 'user',     {value : null});
	Object.defineProperty(this, 'name',     {value : null});
	Object.defineProperty(this, 'port',     {value : null});
	Object.defineProperty(this, 'path',     {value : null});
	Object.defineProperty(this, 'query',    {value : null});
	Object.defineProperty(this, 'fragment', {value : null});
};


/**
 * The string representation
 * @name string
 * @memberOf URI#
 * @type String
 * @throws {TypeError} if not setting a <code>String</code>
 */
Object.defineProperty(URI.prototype, 'string', {
	get : function() {
		var res = "";
		
		var scheme = this.scheme.valid;
		var name = this.name.valid;
		
		if (scheme) res += this.scheme.chars + ":";
		
		if (name) {
			res += "//";
			if (this.user.valid) res += this.user.chars + "@";
			res += this.name.chars;
			if (this.port.valid) res += ":" + this.port.chars;
			if (this.path.valid) res += (this.path.chars[0] !== "/" ? "/" : "") + this.path.chars;
		}
		else if (scheme) {
			if (this.path.valid && this.path.chars.search(/^\/\//) === -1) res += this.path.chars;
		} 
		else if (this.path.valid && this.path.chars.search(/^(\/\/|[^\/]\:)/) === -1) res += this.path.chars;
		
		if (this.query.valid) res += "?" + this.query.chars;
		if (this.fragment.valid) res += "#" + this.fragment.chars;
		
		return res;
	},
	set : function(string) {
		if (typeof string !== 'string' || string === "") throw new TypeError();
		
		var scheme = string.match(URIComponent.SCHEME_URI);
		var user   = string.match(URIComponent.USER_URI);
		var name   = string.match(URIComponent.NAME_URI);
		var port   = string.match(URIComponent.PORT_URI);
		var path   = string.match(URIComponent.PATH_URI);
		var query  = string.match(URIComponent.QUERY_URI);
		var frag   = string.match(URIComponent.FRAGMENT_URI);
		
		if (name !== null) {
			this.user.string = user !== null ? user[1] : "";
			this.name.string = name[1],
			this.port.string = port !== null ? port[1] : "";
		}
		
		this.scheme.string   = scheme !== null ? scheme[1] : "";		
		this.path.string     = path   !== null ? path[1]   : "";
		this.query.string    = query  !== null ? query[1]  : "";
		this.fragment.string = frag   !== null ? frag[1]   : "";
	},
	configurable : true,
	enumerable : true
});


/**
 * <code>true</code> if the instance is empty, <code>false</code> otherwise
 * @name empty
 * @memberOf URI#
 * @readonly
 * @type Boolean
 */
Object.defineProperty(URI.prototype, 'empty', {
	get: function() {
		return (
			this.scheme.empty &&
			this.name.empty &&
			this.path.empty &&
			this.query.empty &&
			this.fragment.empty
		);
	},
	configurable: true,
	enumerable: true
});

/**
 * <code>true</code> if the instance is a valid <em>URI</em>, <code>false</code> otherwise
 * @name valid
 * @memberOf URI#
 * @readonly
 * @type Boolean
 */
Object.defineProperty(URI.prototype, 'valid', {
	get: function() {		
		var has = 
			(!this.scheme.empty ? 0x01 : 0x00) |
			(!this.name.empty ? 0x04 : 0x00) |
			(!this.path.empty ? 0x10 : 0x00) |
			(!this.query.empty ? 0x20 : 0x00) |
			(!this.fragment.empty ? 0x40 : 0x00);
		
		if (has === 0x0) return false;
		
		return (
			((has & 0x01) !== 0x01 || this.scheme.valid) &&
			((has & 0x04) !== 0x04 || this.name.valid) &&
			((has & 0x10) !== 0x10 || this.path.valid && ((has & 0x02) === 0x02 || this.path.chars.search((has & 0x1) === 0x1 ? /^\/\// : /^(\/\/|[^\/]\:)/) === -1)) &&
			((has & 0x20) !== 0x20 || this.query.valid) &&
			((has & 0x40) !== 0x40 || this.fragment.valid) &&
			((has & 0x04) !== 0x04 || this.user.empty || this.user.valid) &&
			((has & 0x04) !== 0x04 || this.port.empty || this.port.valid)
		);
	},
	configurable: true,
	enumerable: true
});


/**
 * The copy of <code>uri</code>
 * @param {URI} uri The uri
 * @returns {undefined}
 * @throws {TypeError} if <code>uri</code> is not a <code>URI</code> instance
 */
URI.prototype.copyOf = function(uri) {
	if (!(uri instanceof URI)) throw new TypeError();
	
	for (var s in uri) {
		if (!(uri[s].constructor instanceof URIComponent)) continue;
		this[s].chars = uri[s].chars;
	}
};


/**
 * Returns a string representation of the <em>uri</em>
 * @returns {String}
 */
URI.prototype.toString = function() {
	return this.string;
};



/**
 * The version string
 * @constant
 * @name VERSION
 * @memberOf URI
 * @type String
 */
Object.defineProperty(URI, 'VERSION', {value : "0.1.1"});


/**
 * Returns an instance represented by <code>string</code>
 * @param {String}  string  The uri string
 * @param {URI}    [target] The target instance
 * @returns {URI}
 * @throws {TypeError} if <code>target</code> is not a <code>URI</code> instance or <code>undefined</code>
 */
URI.String = function(string, target) {
	if (target === undefined) target = new URI();
	else if (!(target instanceof URI)) throw new TypeError();
	else target.define();
	
	target.string = string;
	
	return target;
};


/**
 * Returns a copy of <code>uri</code>
 * @param {URI} uri The uri
 * @returns {URI}
 * @throws {TypeError} if <code>uri</code> is not a <code>URI</code> instance
 */
URI.copy = function(uri) {
	if (!(uri instanceof URI)) throw new TypeError();
	
	var res = new URI();
	
	res.copyOf(uri);
	
	return res;
};


/**
 * Returns a type-version string
 * @returns {String}
 */
URI.toString = function() {
	return "[URI-" + URI.VERSION + "]";
};