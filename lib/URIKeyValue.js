String.prototype.u16CodeAt = function(pos) {
	if (typeof pos !== 'number' || pos < 0 || pos << 0 !== pos) throw new TypeError();
	
	var string = String(this);
	
	if (pos >= string.length) throw new TypeError();
	
	var code = string.charCodeAt(pos).toString(16);
	
	for (var i = code.length; i < 4; ++i) code = "0" + code;
	
	return "\\u" + code;
};




/**
 * Creates a new instance
 * @class Uniform Resource Identifier key/value(s) string manipulation
 * @author <a href="mail@christoph-kettelhoit.de">Christoph Kettelhoit</a>
 * @param {Char} [keyLimit="&"]   The key delimiter
 * @param {Char} [valueLimit="="] The key/value delimiter
 * @param {Char} [listLimit=","]  The value list seperator
 * @returns {URIKeyValue}
 * @throws {TypeError} if <code>keyLimit</code> is not a <code>Char</code> or <code>undefined</code>
 * @throws {TypeError} if <code>valLimit</code> is not a <code>Char</code> or <code>undefined</code>
 * @throws {TypeError} if <code>lstLimit</code> is not a <code>Char</code> or <code>undefined</code>
 * @license Licensed under the LGPL 3 (http://www.gnu.org/licenses/lgpl.html)
 */
function URIKeyValue(keyLimit, valueLimit, listLimit) {	
	if (
		keyLimit   !== undefined && (typeof keyLimit   !== 'string' || keyLimit.length   !== 1) ||
		valueLimit !== undefined && (typeof valueLimit !== 'string' || valueLimit.length !== 1) ||
		listLimit  !== undefined && (typeof listLimit  !== 'string' || listLimit.length  !== 1)
	) throw new TypeError();
	
	/**
	 * The key delimiter
	 * @name keyLimit
	 * @memberOf URIKeyValue#
	 * @readonly
	 * @type Char
	 */
	Object.defineProperty(this, 'keyLimit', {
		value : keyLimit !== undefined ? keyLimit : URIKeyValue.DELIMITER_DEFAULT_KEY,
		configurable : true,
		enumerable : true
	});
	/**
	 * The key/value delimiter
	 * @name valueLimit
	 * @memberOf URIKeyValue#
	 * @readonly
	 * @type Char
	 */
	Object.defineProperty(this, 'valueLimit', {
		value : valueLimit !== undefined ? valueLimit : URIKeyValue.DELIMITER_DEFAULT_VALUE,
		configurable : true,
		enumerable : true
	});
	/**
	 * The value list seperator
	 * @name listLimit
	 * @memberOf URIKeyValue#
	 * @readonly
	 * @type Char
	 */
	Object.defineProperty(this, 'listLimit', {
		value : listLimit !== undefined ? listLimit : URIKeyValue.SEPERATOR_DEFAULT_VALUE,
		configurable : true,
		enumerable : true
	});
	
	/**
	 * The token regular expression
	 * @name tokenExpression
	 * @memberOf URIKeyValue#
	 * @readonly
	 * @type RegExp
	 */
	Object.defineProperty(this, 'tokenExpression', {
		value : new RegExp("^[^" + this.keyLimit.u16CodeAt(0) + this.valueLimit.u16CodeAt(0) + this.listLimit.u16CodeAt(0) + "]+$"),
		configurable : true,
		enumerable : true
	});
	/**
	 * The delimiter regular expression
	 * @name delimiterExpression
	 * @memberOf URIKeyValue#
	 * @readonly
	 * @type RegExp
	 */
	Object.defineProperty(this, 'delimiterExpression', {
		value: new RegExp(this.valueLimit.u16CodeAt(0) + "|" + this.listLimit.u16CodeAt(0)),
		configurable: true,
		enumerable: true
	});
	
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
 * @param {Char} [keyLimit="&"]   The key delimiter
 * @param {Char} [valueLimit="="] The key/value delimiter
 * @param {Char} [listLimit=","]  The value list seperator
 * @returns {undefined}
 */
URIKeyValue.prototype.define = function(keyLimit, valueLimit, listLimit) {
	URIKeyValue.call(this, keyLimit, valueLimit, listLimit);
};


/**
 * The string representation
 * @name string
 * @memberOf URIKeyValue#
 * @type String
 * @throws {Error}     if getting a malformed <em>component</em> string
 * @throws {TypeError} if not setting a nonempty <code>String</code>
 * @throws {Error}     if setting a malformed <em>component</em> string
 */
Object.defineProperty(URIKeyValue.prototype, 'string', {
	get : function() {
		var index = [], dict = {}, string = "";
		
		for (var i = 0, key = this.key[0]; key !== undefined; key = this.key[++i]) {
			if (typeof key !== 'string' || key in dict) throw new Error();
			
			index.push(key);
			dict[key] = i;
		}
		
		for (key in this.value) {
			if (!(key in dict)) index.push(key);
		}
		
		for (i = 0, key = index[0]; key !== undefined; key = index[++i]) {
			if (key.search(this.tokenExpression) === -1) throw new Error();
			
			string += key;
			
			if (key in this.value) {
				if (!(this.value[key] instanceof Array)) throw new Error();
				
				if (this.value[key].length !== 0) {
					string += this.valueLimit;

					for (var j = 0, val = this.value[key][0]; val !== undefined; val = this.value[key][++j]) {
						if (typeof val !== 'string' || val.search(this.tokenExpression) === -1) throw new Error();

						string += val + this.listLimit;
					}
				}
				
				string = string.substring(0, string.length - 1);
			}
			
			string += this.keyLimit;
		}		
		
		return string.substring(0, string.length - 1);		
	},
	set : function(string) {
		if (typeof string !== 'string') throw new TypeError();
		
		var segment = string.split(this.keyLimit);
		var index = [], value = {}, dict = {};
		
		for (var i = 0, seg = segment[0]; seg !== undefined; seg = segment[++i]) {
			if (seg === "") continue;
			
			var val = seg.split(this.delimiterExpression), key = val.shift();
			
			if (key === "") continue;		
			else if (key in dict) throw new Error();
			
			index.push(key);
			dict[key] = i;
			
			if (val.length === 0) continue;
			
			for (var j = val.length - 1; j > -1; --j) {
				if (val[j] === "") val.splice(j, 1);
			}
			
			if (val.length !== 0) value[key] = val;
		}
		
		this.key = index;
		this.value = value;
	},
	configurable : true,
	enumerable : true
});


/**
 * <code>true</code> if the instance is a valid key/value <em>component</em>, <code>false</code> otherwise
 * @name valid
 * @memberOf URIKeyValue#
 * @readonly
 * @type Boolean
 */
Object.defineProperty(URIKeyValue.prototype, 'valid', {
	get : function() {		
		for (var i = 0, key = this.key[0]; key !== undefined; key = this.key[++i]) {
			if (typeof key !== 'string' || key.search(this.tokenExpression) === -1) return false;
		}
		
		for (key in this.value) {
			if (key.search(this.tokenExpression) === -1 || !(this.value[key] instanceof Array)) return false;
			
			for (var j = 0, val = this.value[key][0]; val !== undefined; val = this.value[key][++j]) {
				if (typeof val !== 'string' || val.search(this.tokenExpression) === -1) return false;
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
 * @param {String}    key      The key
 * @param {String[]}  value    Array of values
 * @param {UInt}     [index=0] The insertion index
 * @returns {undefined}
 * @throws {TypeError} if <code>key</code> is not a valid <code>String</code>
 * @throws {TypeError} if <code>value</code> is not a <code>Array</code> of valid <code>String</code>s
 * @throws {TypeError} if <code>index</code> is not a bound <code>UInt</code> or <code>undefined</code>
 */
URIKeyValue.prototype.insertKey = function(key, value, index) {
	if (
		typeof key !== 'string' || key.search(this.tokenExpression) === -1 ||
		!(value instanceof Array) ||
		index !== undefined && (typeof index !== 'number' || index < 0 || index > this.key.length || index << 0 !== index)
	) throw new Error();
	
	index = index || 0;
	
	for (var i = 0, val = value[0]; val !== undefined; val = value[++i]) {
		if (typeof val !== 'string' || val.search(this.tokenExpression) === -1) throw new TypeError();
	}
	
	var j = this.key.indexOf(key);
	
	if (j !== -1) {
		this.key.splice(j, 1);
		index--;
	}
	
	this.key.splice(index, 0, key);
	
	if (i !== 0) this.value[key] = value;
};

/**
 * Appends a ordered key
 * <p>Alias of <code>{@link URIKeyValue#insertKey}</code></p>
 * @param {String}   key   The key
 * @param {String[]} value Array of values
 * @returns {undefined}
 */
URIKeyValue.prototype.appendKey = function(key, value) {
	this.insertKey(key, value, this.key.length);
};


/**
 * Sets <code>key</code> to <code>value</code>
 * @param  {String}   key   The key
 * @param  {String[]} value Array of values
 * @returns {undefined}
 * @throws {TypeError} if <code>key</code> is not a valid <code>String</code>
 * @throws {TypeError} if <code>value</code> is not a <code>Array</code> of valid <code>String</code>s
 */
URIKeyValue.prototype.setKey = function(key, value) {
	if (typeof key !== 'string' || key.search(this.tokenExpression) === -1 || !(value instanceof Array)) throw new TypeError();
	
	for (var i = 0, val = value[0]; val !== undefined; val = value[++i]) {
		if (typeof val !== 'string' || val.search(this.tokenExpression) === -1) throw new TypeError();
	}
	
	this.value[key] = value;
};

/**
 * Return the value(s) of <code>key</code> if set, <code>null</code> otherwise
 * @param {String} key The key
 * @returns {String[]}
 * @throws {TypeError} if <code>key</code> is not a valid <code>String</code>
 */
URIKeyValue.prototype.getKey = function(key) {
	if (typeof key !== 'string' || key.search(this.tokenExpression) === -1) throw new TypeError();
	
	return key in this.value ? this.value[key] : null;
};


/**
 * Removes a key
 * @param {String} key The key
 * @returns {undefined}
 * @throws {TypeError} if <code>key</code> is not a valid <code>String</code>
 */
URIKeyValue.prototype.removeKey = function(key) {
	if (typeof key !== 'string' || key.search(this.tokenExpression) === -1) throw new TypeError();
	
	var index = this.key.indexOf(key);
	
	if (index !== -1) this.key.splice(index, 1);
	
	if (key in this.value) delete this.value[key];
};


/**
 * Returns the index of <code>key</code> for ordered keys, <code>URIKeyValue#key.length</code> for unordered keys, <em>-1</em> for missing keys
 * @param {String} key The key
 * @returns {Int}
 * @throws {TypeError} if <code>key</code> is not a valid <code>String</code>
 */
URIKeyValue.prototype.indexOfKey = function(key) {
	if (typeof key !== 'string' || key.search(this.tokenExpression) === -1) throw new TypeError();
	
	var res = this.key.indexOf(key);
	
	if (res !== -1) return res;
	
	for (var s in this.value) {
		if (s === key) return key.length;
	}
	
	return res;
};


/**
 * The copy of <code>source</code>
 * @param {URIKeyValue} source The source
 * @returns {undefined}
 * @throws {TypeError} if <code>source</code> is not a <code>URIKeyValue</code> instance
 * @throws {TypeError} if <code>source.value</code> is not a <em>Dictionary</em> of <code>Array</code>s
 */
URIKeyValue.prototype.copyOf = function(source) {
	if (!(source instanceof URIKeyValue)) throw new TypeError();
	
	URIKeyValue.call(this, source.keyLimit, source.valueLimit, source.listLimit);
	
	this.key = source.key.slice(0);
	this.value = {};
	
	for (var key in source.value) this.value[key] = source.value[key].slice(0);
};


/**
 * Returns a string representation of the <em>component</em>
 * <p>Alias of <code>{@link URIKeyValue#string}</code></p>
 * @returns {String}
 */
URIKeyValue.prototype.toString = function() {
	return this.string;
};



/**
 * The version string
 * @constant
 * @name VERSION
 * @memberOf URIKeyValue
 * @type String
 */
Object.defineProperty(URIKeyValue, 'VERSION', {value : "0.1.1"});

/**
 * The default key delimiter character
 * @constant
 * @name DELIMTER_DEFAULT_KEY
 * @memberOf URIKeyValue
 * @type Char
 */
Object.defineProperty(URIKeyValue, 'DELIMITER_DEFAULT_KEY',   {
	value : "&",
	enumerable : true
});
/**
 * The default key/value delimter character
 * @constant
 * @name DELIMTER_DEFAULT_VALUE
 * @memberOf URIKeyValue
 * @type Char
 */
Object.defineProperty(URIKeyValue, 'DELIMITER_DEFAULT_VALUE', {
	value : "=",
	enumerable : true
});
/**
 * The default value list seperator
 * @constant
 * @name SEPERATOR_DEFAULT_VALUE
 * @memberOf URIKeyValue
 * @type Char
 */
Object.defineProperty(URIKeyValue, 'SEPERATOR_DEFAULT_VALUE', {
	value : ",",
	enumerable : true
});


/**
 * Returns a instance created from <code>string</code>
 * @param {String}       string      The <em>component</em> string
 * @param {Char}        [keyLimit]   The key delimiter
 * @param {Char}        [valueLimit] The value delimiter
 * @param {Char}        [listLimit]  The value list seperator
 * @param {URIKeyValue} [target]     The target instance
 * @returns {URIKeyValue}
 * @throws {TypeError} if <code>target</code> is not a <code>URIKeyValue</code> instance or <code>undefined</code>
 */
URIKeyValue.String = function(string, keyLimit, valueLimit, listLimit, target) {	
	if (target === undefined) target = new URIKeyValue(keyLimit, valueLimit, listLimit);
	else if (!(target instanceof URIKeyValue)) throw new TypeError();
	else target.define(keyLimit, valueLimit, listLimit);
	
	target.string = string;
	
	return target;
};

/**
 * Returns a instance created from <code>key</code> and <code>value</code>
 * @param {String[]}     key         Array of keys
 * @param {Array{}}      value       Dictionary of Arrays of Strings
 * @param {Char}        [keyLimit]   The key delimiter
 * @param {Char}        [valueLimit] The value delimiter
 * @param {Char}        [listLimit]  The value list seperator
 * @param {URIKeyValue} [target]     The target instance
 * @returns {URIKeyValue}
 * @throws {TypeError} if <code>key</code> is not a <code>Array</code> of valid <code>String</code>s
 * @throws {TypeError} if <code>value</code> is not a <em>Dictionary</em> of <code>Array</code>s of valid <code>String</code>s
 * @throws {TypeError} if <code>target</code> is not a <code>URIKeyValue</code> instance or <code>undefined</code>
 */
URIKeyValue.Key = function(key, value, keyLimit, valueLimit, listLimit, target) {
	if (!(key instanceof Array) || !value || value.constructor !== Object) throw new TypeError();
	
	if (target === undefined) target = new URIKeyValue(keyLimit, valueLimit, listLimit);
	else if (!(target instanceof URIKeyValue)) throw new TypeError();
	else target.define(keyLimit, valueLimit, listLimit);
	
	var dict = {};
	
	for (var i = 0, s = key[0]; s !== undefined; s = key[++i]) {
		if (typeof s !== 'string' || s in dict || s.search(target.tokenExpression) === -1) throw new TypeError();
		
		dict[s] = i;
	}
	
	for (s in value) {
		if (s.search(target.tokenExpression) === -1 || !(value[s] instanceof Array)) throw new TypeError();
		
		for (var j = 0, t = value[s][0]; t !== undefined; t = value[s][++j]) {
			if (typeof t !== 'string' || t.search(target.tokenExpression) === -1) throw new TypeError();
		}
	}
	
	target.key = key;
	target.value = value;
};


/**
 * Returns a copy of <code>source</code>
 * <p>Alias of <code>{@link URIKeyValue#copyOf}</code></p>
 * @param {URIKeyValue} source The source
 * @returns {URIKeyValue}
 */
URIKeyValue.copy = function(source) {
	var res = new URIKeyValue();
	
	res.copy(source);
	
	return res;
};


/**
 * Returns a type-version string
 * @returns {String}
 */
URIKeyValue.toString = function() {
	return "[URIKeyValue-" + URIKeyValue.VERSION + "]";
};