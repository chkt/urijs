/**
 * Creates a new instance
 * @class Uniform Resource Identifier name <em>component</em> manipulation
 * @extends URIComponent
 * @author <a href="mail@christoph-kettelhoit.de">Christoph Kettelhoit</a>
 * @returns {URINameComponent}
 * @license Licensed under the LGPL 3 (http://www.gnu.org/licenses/lgpl.html)
 */
function URINameComponent() {
	URIComponent.call(this, this.TYPE_NAME);
}


URINameComponent.prototype = new URIComponent(URIComponent.prototype.TYPE_NAME);


/**
 * The forward notation <em>alias</em>
 * @constant
 * @name NAME_FORWARD
 * @memberOf URINameComponent#
 * @type Int
 */
Object.defineProperty(URINameComponent.prototype, 'NAME_FORWARD', {
	value : 0x0,
	enumerable : true
});
/**
 * The reverse notation <em>bit</em>
 * @constant
 * @name NAME_REVERSE
 * @memberOf URINameComponent#
 */
Object.defineProperty(URINameComponent.prototype, 'NAME_REVERSE', {
	value : 0x1,
	enumerable : true
});


/**
 * The constructor
 * @type Function
 */
URINameComponent.prototype.constructor = URINameComponent;


/**
 * (Re)defines the instance
 * @returns {undefined}
 */
URINameComponent.prototype.define = function() {
	URIComponent.call(this, this.TYPE_NAME);
};


/**
 * The reverse notation string representation
 * @name stringReverse
 * @memberOf URINameComponent#
 * @type String
 * @throws {TypeError} if <code>string</code> is not a nonempty <code>String</code>
 */
Object.defineProperty(URINameComponent.prototype, 'stringReverse', {
	get : function() {
		var segment = this.string.split(".");
		
		segment.reverse();
		
		return segment.join(".");
	},
	set : function(string) {
		if (typeof string !== 'string' || string === "") throw new TypeError();
		
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
 * @throws {TypeError} if not setting a nonempty <code>Array</code> of nonempty <code>String</code>s
 */
Object.defineProperty(URINameComponent.prototype, 'segment', {
	get : function() {
		var res = this.string.split(".");
		
		res.reverse();
		
		return res;
	},
	set : function(segment) {
		if (!(segment instanceof Array) || segment.length === 0) throw new TypeError();
		
		var string = "";
		
		for (var i = segment.length - 1; i > -1; i--) {
			if (typeof segment[i] !== 'string' || segment[i] === "") throw new TypeError();
			
			string += segment[i] + ".";
		}
		
		this.string = string.substring(0, string.length - 1);
	},
	configurable : true,
	enumerable : true
});


/**
 * Returns a string representation of the <em>component</em>
 * @param {Int} [flags=URINameComponent#NAME_FORWARD] The flags
 * @returns {String}
 * @throws {TypeError} if <code>flags</code> is not a <code>Int</code> or <code>null</code>
 */
URINameComponent.prototype.toString = function(flags) {
	if (flags !== undefined && (typeof flags !== 'number' || flags << 0 !== flags)) throw new TypeError();
	
	flags = flags || this.NAME_FORWARD;
	
	return flags & this.NAME_REVERSE ? this.stringReverse : this.string;
};



/**
 * The version string
 * @constant
 * @name VERSION
 * @memberOf URINameComponent
 * @type String
 */
Object.defineProperty(URINameComponent, 'VERSION', {value : "0.1.3"});


/**
 * Returns a instance extracted from <code>string</code>
 * @param {String}            string  The <em>uri</em> string
 * @param {URINameComponent} [target] The target instance
 * @returns {URINameComponent}
 * @throws {TypeError} if <code>target</code> is not a <code>URINameComponent</code> instance or <code>undefined</code>
 */
URINameComponent.URIString = function(string, target) {
	if (target === undefined) target = new URINameComponent();
	else if (!(target instanceof URINameComponent)) throw new TypeError();
	
	return URIComponent.URIString(string, target.TYPE_NAME, target);
};

/**
 * Returns a instance represented by <code>string</code>
 * @param {String}            string                               The <em>component</em> string
 * @param {Int}              [flags=URINameComponent#NAME_FORWARD] The flags
 * @param {URINameComponent} [target]                              The target instance
 * @returns {URINameComponent}
 * @throws {TypeError} if <code>flags</code> is not a <code>Int</code> or <code>undefined</code>
 * @throws {TypeError} if <code>target</code> is not a <code>URINameComponent</code> instance or <code>undefined</code>
 */
URINameComponent.ComponentString = function(string, flags, target) {
	if (flags !== undefined && (typeof flags !== 'number' || flags << 0 !== flags)) throw new TypeError(); 
	
	if (target === undefined) target = new URINameComponent();
	else if (!(target instanceof URINameComponent)) throw new TypeError();
	else target.define();
	
	flags = flags || target.NAME_FORWARD;
	
	if (flags & target.NAME_REVERSE) target.stringReverse = string;
	else target.string = string;
	
	return target;
};

/**
 * Returns a instance represented by <code>segment</code>
 * @param {String[]}          segment The reverse notation <em>segment</em> array
 * @param {URINameComponent} [target] The target instance
 * @returns {URINameComponent}
 * @throws {TypeError} if <code>target</code> is not a <code>URINameComponent</code> instance or <code>undefined</code>
 */
URINameComponent.Array = function(segment, target) {
	if (target === undefined) target = new URINameComponent();
	else if (!(target instanceof URINameComponent)) throw new TypeError();
	else target.define();
	
	target.segment = segment;
	
	return target;
};


/**
 * Returns a copy of <code>name</code>
 * @param {URINameComponent} name The name component
 * @returns {URINameComponent}
 * @throws {TypeError} if <code>name</code> is not a <code>URINameComponent</code> instance
 */
URINameComponent.copy = function(name) {
	if (!(name instanceof URINameComponent)) throw new TypeError();
	
	var res = new URINameComponent();
	
	res.chars = name.chars;
	
	return res;
};


/**
 * Returns a type-version string
 * @returns {String}
 */
URINameComponent.toString = function() {
	return "[URINameComponent-" + URINameComponent.VERSION + "]";
};