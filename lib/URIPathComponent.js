/**
 * Creates a new instance
 * @class Uniform Resource Identifier path <em>component</em> manipulation
 * @extends URIComponent
 * @author <a href="mail@christoph-kettelhoit.de">Christoph Kettelhoit</a>
 * @returns {URIPathComponent}
 * @license Licensed under the LGPL 3 (http://www.gnu.org/licenses/lgpl.html)
 */
function URIPathComponent() {
	URIComponent.call(this, this.TYPE_PATH);
}


URIPathComponent.prototype = new URIComponent(URIComponent.prototype.TYPE_PATH);

/**
 * The constructor
 * @type Function
 */
URIPathComponent.prototype.constructor = URIPathComponent;


/**
 * (Re)defines the instance
 * @returns {undefined}
 */
URIPathComponent.prototype.define = function() {
	URIComponent.call(this, this.TYPE_PATH);
};


/**
 * The resolved path string representation
 * @name stringResolved
 * @memberOf URIPathComponent#
 * @readonly
 * @type String
 */
Object.defineProperty(URIPathComponent.prototype, 'stringResolved', {
	get : function() {
		var segment = this.string.split("/"), last = segment.length - 1;
		var resolve = [], n = 0;
		
		for (var i = 0, s = segment[0]; s !== undefined; s = segment[++i]) {
			switch (s) {
				case "." :
					if (i === 0 || i === last) resolve.push(s);
					
					continue;
				case ".." :
					if (n !== 0 && i !== last) {
						resolve.pop();
						n--;
					} else resolve.push(s);
					
					continue;
				case "" :
					resolve.push(s);
					
					if (i !== 0) n++;
					
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
 * A <em>segment</em> array
 * <p>[dereferenced]</p>
 * <p>First element will be a empty <code>String</code> if path is absolute, last element will be a empty <code>String</code> if path is ending in a slash.</p>
 * @name segment
 * @memberOf URIPathComponent#
 * @type String[]
 * @throws {TypeError} if not setting a nonempty <code>Array</code> of <code>String</code>s
 */
Object.defineProperty(URIPathComponent.prototype, 'segment', {
	get : function() {
		return this.string.split("/");
	},
	set : function(segment) {
		if (!(segment instanceof Array) || segment.length === 0) throw new TypeError();
		
		var string = "";
		
		for (var i = 0, l = segment.length; i < l; i++) {
			if (typeof segment[i] !== 'string') throw new TypeError();
			
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
 * @throws {TypeError} if not setting a <code>Boolean</code>
 */
Object.defineProperty(URIPathComponent.prototype, 'absolute', {
	get : function() {
		return this.chars[0] === "/";
	},
	set : function(absolute) {
		if (typeof absolute !== 'boolean') throw new TypeError();
		
		if (absolute) {
			if (this.chars[0] !== "/") this.chars = "/" + this.chars;
			
			return;
		}
		
		if (this.chars[0] === "/") this.chars = this.chars.substring(1);
	},
	configurable : true,
	enumerable : true
});

/**
 * The last path segment
 * @name lastSegment
 * @memberOf URIPathComponent#
 * @type String
 * @throws {TypeError} if not setting a valid path <em>segment</em> <code>String</code>
 */
Object.defineProperty(URIPathComponent.prototype, 'lastSegment', {
	get : function() {
		var s = this.string;
		var i = s.lastIndexOf("/");
		
		if (i === -1) return s;
		
		return s.substring(i + 1);
	},
	set : function(string) {
		if (typeof string !== 'string' || string.search(URIComponent.PATH_SEGMENT) === -1) throw new TypeError();
		
		var s = this.string;
		var i = s.lastIndexOf("/");
		
		if (i === -1) this.chars = string;
		
		this.chars = s.substring(0, i + 1) + string;
	},
	configurable : true,
	enumerable : true
});


/**
 * Resolves local path segment references
 * @returns {undefined}
 */
URIPathComponent.prototype.resolve = function() {
	this.chars = this.stringResolved;
};



/**
 * The version string
 * @constant
 * @name VERSION
 * @memberOf URIPathComponent
 * @type String
 */
Object.defineProperty(URIPathComponent, 'VERSION', {value : "0.1.3"});


/**
 * Returns a instance extracted from <code>string</code>
 * @param {String}            string  The <em>uri</em> string
 * @param {URIPathComponent} [target] The target instance
 * @returns {URIPathComponent}
 * @throws {TypeError} if <code>target</code> is not a <code>URIPathComponent</code> instance or <code>undefined</code>
 */
URIPathComponent.URIString = function(string, target) {
	if (target === undefined) target = new URIPathComponent();
	else if (!(target instanceof URIPathComponent)) throw new TypeError();
	
	return URIComponent.URIString(string, target.TYPE_PATH, target);
};

/**
 * Returns a instance represented by <code>string</code>
 * @param {String}            string  The <em>component</em> string
 * @param {URIPathComponent} [target] The target instance
 * @returns {URIPathComponent}
 * @throws {TypeError} if <code>target</code> is not a <code>URIPathComponent</code> instance or <code>undefined</code>
 */
URIPathComponent.ComponentString = function(string, target) {
	if (target === undefined) target = new URIPathComponent();
	else if (!(target instanceof URIPathComponent)) throw new TypeError();
	
	return URIComponent.ComponentString(string, target.TYPE_PATH, target);
};

/**
 * Returns a instance represented by <code>segment</code>
 * @param {String[]}          segment The <em>segment</em> array
 * @param {URIPathComponent} [target] The target instance
 * @returns {URIPathComponent}
 * @throws {TypeError} if <code>target</code> is not a <code>URIPathComponent</code> instance or <code>undefined</code>
 */
URIPathComponent.Array = function(segment, target) {
	if (target === undefined) target = new URIPathComponent();
	else if (!(target instanceof URIPathComponent)) throw new TypeError();
	else target.define();
	
	target.segment = segment;
	
	return target;
};


/**
 * Returns a copy of <code>path</code>
 * @param {URIPathComponent} path The path component
 * @returns {URIPathComponent}
 * @throws {TypeError} if <code>path</code> is not a <code>URIPathComponent</code> instance
 */
URIPathComponent.copy = function(path) {
	if (!(path instanceof URIPathComponent)) throw new TypeError();
	
	var res = new URIPathComponent();
	
	res.chars = path.chars;
	
	return res;
};


/**
 * Returns a type-version string
 * @returns {String}
 */
URIPathComponent.toString = function() {
	return "[URIPathComponent-" + URIPathComponent.VERSION + "]";
};