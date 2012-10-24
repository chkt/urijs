/**
 * Creates a new instance
 * @class Uniform Resource Identifier key/value(s) string manipulation
 * @requires URIComponent
 * @license Licensed under the LGPL 3 (http://www.gnu.org/licenses/lgpl.html)
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
	 * @memberOf URIKeyValue#
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
	 * @memberOf URIKeyValue#
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
	 * @memberOf URIKeyValue#
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
	 * @memberOf URIKeyValue#
	 * @type RegExp
	 */
	Object.defineProperty(this, 'tokenExpression', {
		value : new RegExp("^[^\\" + this.keyLimit + "\\" + this.valueLimit + "\\" + this.listLimit + "]+$"),
		configurable : true,
		enumerable : true
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
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>index</code> is not a bound <code>UInt</code> or <code>null</code>
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
 * Returns the index of <code>key</code> for ordered keys, <code>URIKeyValue#key.length</code> for unordered keys, <em>-1</em> for missing keys
 * @param  {String} key The key
 * @return {Int}
 * @throws {TypeError} <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>key</code> is not a valid <code>String</code>
 */
URIKeyValue.prototype.indexOfKey = function(key) {
	if (!key || typeof key != 'string' || key.search(this.tokenExpression) == -1) throw new TypeError(URIComponent.ERROR_ARGUMENT);
	
	var res = this.key.indexOf(key);
	
	if (res != -1) return res;
	
	for (var s in this.value) {
		if (s == key) return key.length;
	}
	
	return res;
};


/**
 * The copy of <code>source</code>
 * @param  {URIKeyValue} source The source
 * @return {void}
 * @throws <code>{@link URIComponent.ERROR_ARGUMENT}</code> if <code>source</code> is not a <code>URIKeyValue</code> instance
 * @throws <code>{@link URIComponent.ERROR_MALFORMED}</code> if <code>source.value</code> is not a <em>Dictionary</em> of <code>Array</code>s
 */
URIKeyValue.prototype.copyOf = function(source) {
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
Object.defineProperty(URIKeyValue, 'VERSION', {value : "0.1.0"});

/**
 * The default key delimiter character
 * @static
 * @constant
 * @name DELIMTER_DEFAULT_KEY
 * @memberOf URIKeyValue
 * @type Char
 */
Object.defineProperty(URIKeyValue, 'DELIMITER_DEFAULT_KEY',   {value : "&"});
/**
 * The default key/value delimter character
 * @static
 * @constant
 * @name DELIMTER_DEFAULT_VALUE
 * @memberOf URIKeyValue
 * @type Char
 */
Object.defineProperty(URIKeyValue, 'DELIMITER_DEFAULT_VALUE', {value : "="});
/**
 * The default value list seperator
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
 * Returns a instance created from <code>key</code> and <code>value</code>
 * @static
 * @param  {String[]}    key          <code>Array</code> of keys
 * @param  {Array{}}     value        <em>Dictionary</em> of <code>Array</code>s of <code>String</code>s
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
 * <p>Alias of <code>{@link URIKeyValue#copyOf}</code></p>
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
};