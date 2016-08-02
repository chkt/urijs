import * as exstr from './extendedString';



/**
 * The scheme component type
 * @name TYPE_SCHEME
 * @type Int
 */
export const TYPE_SCHEME = 1;
/**
 * The user component type
 * @name TYPE_USER
 * @type Int
 */
export const TYPE_USER = 2;
/**
 * The name component type
 * @name TYPE_NAME
 * @type Int
 */
export const TYPE_NAME = 3;
/**
 * The port component type
 * @name TYPE_PORT
 * @type Int
 */
export const TYPE_PORT = 4;
/**
 * The path component type
 * @name TYPE_PATH
 * @type Int
 */
export const TYPE_PATH = 5;
/**
 * The query component type
 * @name TYPE_QUERY
 * @type Int
 */
export const TYPE_QUERY = 6;
/**
 * The fragment component type
 * @name TYPE_FRAGMENT
 * @type Int
 */
export const TYPE_FRAGMENT = 7;


const TYPES = Object.freeze([
	TYPE_SCHEME,
	TYPE_USER,
	TYPE_NAME,
	TYPE_PORT,
	TYPE_PATH,
	TYPE_QUERY,
	TYPE_FRAGMENT
]);


const EXPR_COMPONENT_SCHEME = /^[a-z][+\-.0-9a-z]*$/;
const EXPR_COMPONENT_USER = /^([!$&'()*+,\-.0-9:;=A-Z_a-z~]|%[0-9A-F]{2})+$/;
const EXPR_COMPONENT_NAME = /^([!$&'()*+,\-.0-9;=A-Z_a-z~]|%[0-9A-F]{2})+$/;
const EXPR_COMPONENT_PORT = /^\d+$/;
const EXPR_COMPONENT_PATH = /^(?:[!$&'()*+,\-./0-9:;=@A-Z_a-z~]|%[0-9A-F]{2})+$/;
const EXPR_COMPONENT_QUERY = /^(?:[!$&'()*+,\-./0-9:;=?@A-Z_a-z~]|%[0-9A-F]{2})+$/;
const EXPR_COMPONENT_FRAGMENT = /^(?:[!$&'()*+,\-./0-9:;=?@A-Z_a-z~]|%[0-9A-F]{2})+$/;

const EXPR_URI_SCHEME = /^([^/:]*)\:/;
const EXPR_URI_USER = /^(?:[^/]*\:)?\/{2}([^@/?#]*)(?:@)/;
const EXPR_URI_NAME = /^(?:[^/]*\:)?\/{2}(?:[^/]*@)?([^:/?#]*)/;
const EXPR_URI_PORT = /^(?:[^/]*\:)?\/{2}[^/]*\:([^@/?#]*)(?:\/|\?|#|$)/;
const EXPR_URI_PATH = /^(?:(?:[^/]*\:)?\/{2}[^/?#]*|[^/]+?\:|(?=.))([^?#]*)/;
const EXPR_URI_QUERY = /\?([^#]*)/;
const EXPR_URI_FRAGMENT = /#(.*)$/;

const EXPR_ED_NONE = /$^/;
const EXPR_DE_UNRESERVED = /(?:%(?:2[DE]|3[0-9]|[46][1-9A-F]|5[0-9AF]|7[0-9AE]))+/gi;
const EXPR_EN = /[\u0000-\u0020\u0022\u0023\u002F\u003A\u003C\u003E-\u0040\u005B-\u005E\u0060\u007B-\u007D\u007F-\uFFFF]/g
const EXPR_EN_XC = /[\u0000-\u0020\u0022\u0023\u002F\u003C\u003E-\u0040\u005B-\u005E\u0060\u007B-\u007D\u007F-\uFFFF]/g;
const EXPR_EN_XCAS = /[\u0000-\u0020\u0022\u0023\u003C\u003E\u003F\u005B-\u005E\u0060\u007B-\u007D\u007F-\uFFFF]/g;
const EXPR_EN_XCASQ = /[\u0000-\u0020\u0022\u0023\u003C\u003E\u005B-\u005E\u0060\u007B-\u007D\u007F-\uFFFF]/g;

const EXPR_ENTITY = /(?:%[0-9A-Z]{2})+/gi;

const FLAG_NORM_NONE = 0x0;
const FLAG_NORM_U = 0x1;
const FLAG_NORM_E = 0x2;
const FLAG_NORM_EN = 0x4;
const FLAG_NORM_DE = 0x8;



const _type = new WeakMap();
const _string = new WeakMap();



function _getExpressions(type) {
	return {
		[ TYPE_SCHEME ] : {
			uri : EXPR_URI_SCHEME,
			cmp : EXPR_COMPONENT_SCHEME,
			edf : FLAG_NORM_U,
			enc : EXPR_ED_NONE,
			dec : EXPR_ED_NONE
		},
		[ TYPE_USER ] : {
			uri : EXPR_URI_USER,
			cmp : EXPR_COMPONENT_USER,
			edf : FLAG_NORM_EN | FLAG_NORM_DE | FLAG_NORM_E,
			enc : EXPR_EN_XC,
			dec : EXPR_DE_UNRESERVED
		},
		[ TYPE_NAME ] : {
			uri : EXPR_URI_NAME,
			cmp : EXPR_COMPONENT_NAME,
			edf : FLAG_NORM_EN | FLAG_NORM_DE | FLAG_NORM_E,
			enc : EXPR_EN,
			dec : EXPR_DE_UNRESERVED
		},
		[ TYPE_PORT ] : {
			uri : EXPR_URI_PORT,
			cmp : EXPR_COMPONENT_PORT,
			edf : FLAG_NORM_NONE,
			enc : EXPR_ED_NONE,
			dec : EXPR_ED_NONE
		},
		[ TYPE_PATH ] : {
			uri : EXPR_URI_PATH,
			cmp : EXPR_COMPONENT_PATH,
			edf : FLAG_NORM_EN | FLAG_NORM_DE | FLAG_NORM_E,
			enc : EXPR_EN_XCAS,
			dec : EXPR_DE_UNRESERVED
		},
		[ TYPE_QUERY ] : {
			uri : EXPR_URI_QUERY,
			cmp : EXPR_COMPONENT_QUERY,
			edf : FLAG_NORM_EN | FLAG_NORM_DE | FLAG_NORM_E,
			enc : EXPR_EN_XCASQ,
			dec : EXPR_DE_UNRESERVED
		},
		[ TYPE_FRAGMENT ] : {
			uri : EXPR_URI_FRAGMENT,
			cmp : EXPR_COMPONENT_FRAGMENT,
			edf : FLAG_NORM_EN | FLAG_NORM_DE | FLAG_NORM_E,
			enc : EXPR_EN_XCASQ,
			dec : EXPR_DE_UNRESERVED
		}
	}[type];
}



export default class URIComponent {

	/**
	 * Returns a instance of component type represented by string
	 * @param {Int} type The component type
	 * @param {String} [string] The component string
	 * @param {URIComponent} [target] The target instance
	 * @returns {URIComponent}
	 * @throws {TypeError} if target is not a URIComponent instance or undefined
	 */
	static ComponentString(type, string, target) {
		if (target === undefined) return new URIComponent(type, string);

		if (target instanceof URIComponent) return target.define(type, string);

		throw new TypeError();
	}

	/**
	 * Returns a instance of component type extracted from string
	 * @constructor
	 * @param {Int} type The component type
	 * @param {String} string The uri string
	 * @param {URIComponent} [target] The target instance
	 * @returns {URIComponent}
	 * @throws {TypeError} if string is not a String
	 * @throws {TypeError} if target is not a URIComponent instance or undefined
	 */
	static URIString(type, string,  target) {
		if (typeof string !== 'string') throw new TypeError();

		const { uri } = _getExpressions(type);
		const match = string.match(uri);
		const component = match !== null ? match[1] : '';

		return this.ComponentString(type, component, target);
	}

	/**
	 * Returns a copy of source
	 * @param {URIComponent} source
	 * @param {URIComponent} [target]
	 * @returns {URIComponent}
	 */
	static copy(source, target) {
		if (!(source instanceof URIComponent)) throw new TypeError();

		return URIComponent.ComponentString(_type.get(source), _string.get(source), target);
	}

	/**
	 * Returns true if a and b are equal, false otherwise
	 * @param {URIComponent} a
	 * @param {URIComponent} b
	 * @returns {Boolean}
	 * @throws {TypeError} if a is not a URIComponent instance
	 * @throws {TypeError} if b is not a URIComponent instance
	 */
	static isEQ(a, b) {
		if (!(a instanceof URIComponent) || !(b instanceof URIComponent)) throw new TypeError();

		return _type.get(a) === _type.get(b) && _string.get(a) === _string.get(b);
	}



	constructor(type, string = "") {
		if (TYPES.indexOf(type) === -1) throw new TypeError();

		_type.set(this, type);
		_string.set(this, "");

		if (string !== "") this.string = string;
	}


	/**
	 * The component type of the instance
	 * @name type
	 * @type Int
	 */
	get type() {
		return _type.get(this);
	}


	/**
	 * The encoded string representation
	 * @name string
	 * @type String
	 * @throws {TypeError} if not setting a string
	 * @throws {Error}  if setting an invalid component string
	 */
	get string() {
		return _string.get(this);
	}

	set string(string) {
		if (typeof string !== 'string') throw new TypeError();

		if (string !== "") {
			const { cmp, edf, enc, dec } = _getExpressions(_type.get(this));

			if (edf & FLAG_NORM_DE) string = string.replace(dec, match => exstr.fromPctChar(match));

			if (edf & FLAG_NORM_EN) string = string.replace(enc, match => exstr.pctCharAt(match, 0));

			if (edf & FLAG_NORM_U) string = string.toLowerCase();

			if (edf & FLAG_NORM_E) string = string.replace(EXPR_ENTITY, match => match.toUpperCase());

			if (string.search(cmp) === -1) throw new Error();
		}

		_string.set(this, string);
	}

	/**
	 * true if the instance is empty, false otherwise
	 * @name empty
	 * @type Boolean
	 */
	get empty() {
		return _string.get(this).length === 0;
	}


	/**
	 * Redefines the instance
	 * @param {Int} type The component type
	 * @param {String} [string=''] The uri string
	 * @returns {URIComponent}
	 */
	define(type, string = "") {
		this.constructor.call(this, type, string);

		return this;
	}


	/**
	 * Copies source
	 * @param {URIComponent} source
	 * @returns {URIComponent}
	 * @throws {TypeError} if source is not a URIComponent instance
	 */
	copyOf(source) {
		if (!(source instanceof URIComponent)) throw new TypeError();

		return this.define(_type.get(source), _string.get(source));
	}

	/**
	 * Returns a string representation of the instance
	 * @returns {String}
	 */
	toString() {
		return _string.get(this);
	}
}
