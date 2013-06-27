/**
 * Creates a new Instance
 * @class Uniform Resource Identifier manipulation
 * @requires URIComponent
 * @license Licensed under the LGPL 3 (http://www.gnu.org/licenses/lgpl.html)
 * @author <a href="mail@christoph-kettelhoit.de">Christoph Kettelhoit</a>
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
 * @return {void}
 */
URI.prototype.define = function() {
	if (this.name) this.undefine();
	
	URI.call(this);
};

/**
 * Undefines the instance
 * @return {void}
 */
URI.prototype.undefine = function() {
	if (!this.name) return;
	
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
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if not setting a <code>String</code>
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
			if (this.path.valid) res += (this.path.chars[0] != "/" ? "/" : "") + this.path.chars;
		} else if (scheme) {
			if (this.path.valid) res += this.path.chars;
		} else if (this.path.valid && this.path.chars.search(/^[^\/]\:/) === -1) res += this.path.chars;
		
		if (this.query.valid) res += "?" + this.query.chars;
		if (this.fragment.valid) res += "#" + this.fragment.chars;
		
		return res;
	},
	set : function(string) {
		if (!string  || typeof string != 'string') throw new Error(URIComponent.ERROR_ARGUMENT);
		
		var scheme = string.match(URIComponent.SCHEME_URI);
		var user   = string.match(URIComponent.USER_URI);
		var name   = string.match(URIComponent.NAME_URI);
		var port   = string.match(URIComponent.PORT_URI);
		var path   = string.match(URIComponent.PATH_URI);
		var query  = string.match(URIComponent.QUERY_URI);
		var frag   = string.match(URIComponent.FRAGMENT_URI);
		
		if (name) {
			this.user.chars = user ? user[1] : "";
			this.name.chars = name[1],
			this.port.chars = port ? port[1] : "";
		}
		
		this.scheme.chars = scheme ? scheme[1] : "";		
		this.path.chars     = path  ? path[1] : "";
		this.query.chars    = query ? path[1] : "";
		this.fragment.chars = frag  ? frag[1] : "";
	},
	configurable : true,
	enumerable : true
});


/**
 * The copy of <code>uri</code>
 * @param  {URI} uri The uri
 * @return {void}
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>uri</code> is not a <code>URI</code> instance
 */
URI.prototype.copy = function(uri) {
	if (!uri || uri.constructor != URI) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	
	for (var s in uri) {
		if (uri[s].constructor != URIComponent) continue;
		this[s].chars = uri[s].chars;
	}
};


/**
 * Returns a string representation of the <em>uri</em>
 * @return {String}
 */
URI.prototype.toString = function() {
	return this.string;
};



/**
 * The version string
 * @static
 * @constant
 * @name VERSION
 * @memberOf URI
 * @type String
 */
Object.defineProperty(URI, 'VERSION', {value : "0.0.1"});


/**
 * Returns a instance represented by <code>string</code>
 * @param  {String} string   The uri string
 * @param  {URI}    [target] The target instance
 * @return {URI}
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>target</code> is not a <code>URI</code> instance or <code>null</code>
 */
URI.String = function(string, target) {
	if (!target) target = new URI();
	else if (target.constructor != URI) throw new Error(URIComponent.ERROR_ARGUMENT);
	else target.define();
	
	target.string = string;
	
	return target;
};


/**
 * Returns a copy of <code>uri</code>
 * @param  {URI} uri The uri
 * @return {URI}
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>uri</code> is not a <code>URI</code> instance
 */
URI.copy = function(uri) {
	if (!uri || uri.constructor != URI) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	
	var res = new URI();
	
	for (var s in uri) {
		if (uri[s].constructor != URIComponent) continue;
		
		res[s].chars = uri[s].chars;
	}
	
	return res;
};


/**
 * Returns a type-version string
 * @return {String}
 */
URI.toString = function() {
	return "[URI" + URI.VERSION + "]";
};