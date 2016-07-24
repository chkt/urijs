/**
 * Returns a copy of this extended by pattern
 * @param {String} pattern The extension pattern
 * @param {Uint} [length] The extension length
 * @returns {String}
 * @throws {TypeError} if pattern is not a nonempty String
 * @throws {TypeError} if length is not an Uint or undefined
 */
function _extendLeft(pattern, length) {
	if (length === undefined) length = pattern.length;

	if (
		typeof pattern !== 'string' || pattern === "" ||
		!Number.isSafeInteger(length) || length < 0
	) throw new TypeError();

	const str = String(this);

	for (let l = pattern.length; l < length; ) pattern += pattern, l *= 2;

	return pattern.substr(0, Math.max(length - str.length, 0)) + str;
}

/**
 * Returns an Array of utf-8 encoded character codes of this at index
 * @param {Int} index The character index
 * @returns {Array}
 * @throws {TypeError} if index is not an Int
 * @throws {RangeError} if index is not in range
 * @throws {Error} if the character at index is invalid
 */
function _u8CharCodeAt(index) {
	if (!Number.isSafeInteger(index)) throw new TypeError();

	const string = String(this);

	if (index < 0 || index >= string.length) throw new RangeError();

	let code = string.charCodeAt(index);

	if (code < 0x0080) return [ code ];     //0000-0000-0xxx-xxxx

	if ((code & 0xF800) === 0xD800) {       //1101-1xxx-xxxx-xxxx
		let lead, trail;

		if ((code & 0x0400) === 0x0400) {   //1101-11xx-xxxx-xxxx
			lead = string.charCodeAt(index - 1);
			trail = code;

			if ((lead & 0xFC00) != 0xD800) throw new Error();
		}
		else {
			lead = code;
			trail = string.charCodeAt(index + 1);
		}

		if ((trail & 0xDC00) === 0xDC00) code = ((lead & ~0xD800) << 10 | (trail & ~0xDC00)) + 0x010000;
	}

	const res = [];
	let mark, mf, ff, o;

	if (code < 0x000800)      mark = 0x00C0, mf = 0x0007C0, ff = 0x00003F, o = 6;
	else if (code < 0x010000) mark = 0x00E0, mf = 0x00F000, ff = 0x000FC0, o = 12;
	else                      mark = 0x00F0, mf = 0x1C0000, ff = 0x03F000, o = 18;

	res.push((mark + ((code & mf) >>> o)));

	for (o -= 6; ff !== 0; ff >>>= 6, o -= 6) res.push((0x0080 + ((code & ff) >> o)));

	return res;
}

/**
 * Returns an instance created from utf-8 encoded character codes
 * @param {Uint[]} char
 * @returns {String}
 * @throws {TypeError} if char is not an Array
 * @throws {Error} if char is not a valid sequence of utf-8 encoded character codes
 */
export function fromUtf8CharCode(char) {
	if (!Array.isArray(char)) throw new TypeError();

	let res = "";

	for (let i = 0, l = char.length; i < l; i += 1) {
		const n0 = char[i];

		if (!Number.isSafeInteger(n0)) throw new Error();

		if ((n0 & ~0b01111111) === 0) {
			res += String.fromCharCode(n0);

			continue;
		}

		let mask, f;

		if      ((n0 & 0b11000000) === 0b10000000) throw new Error();
		else if ((n0 & 0b11100000) === 0b11000000) mask = 0b11100000, f = 1;
		else if ((n0 & 0b11110000) === 0b11100000) mask = 0b11110000, f = 2;
		else if ((n0 & 0b11111000) === 0b11110000) mask = 0b11111000, f = 3;
		else throw new Error();

		let code = (n0 & ~mask) << f * 6;

		for (let j = 1; j <= f; j += 1) {
			const index = i + j;

			if (index >= l) throw new Error();

			const nN = char[index];

			if (!Number.isSafeInteger(nN) || nN > 0xff || (nN & 0b11000000) !== 0b10000000) throw new Error();

			code |= (nN & 0b00111111) << (f - j) * 6;
		}

		if (
			code < 0x000080 || code > 0x10ffff ||
			f === 2 && code < 0x000800 ||
			f === 3 && code < 0x010000
		) throw new Error();

		i += f;

		if (code < 0x010000) res += String.fromCharCode(code);
		else {
			code -= 0x010000;
			res += String.fromCharCode(0xD800 | (code & 0x0FFC00) >> 10, 0xDC00 | code & 0x0003FF);
		}
	}

	return res;
}

/**
 * Returns an instance created from a string of percent encoded character codes
 * @param {String} char
 * @returns {String}
 * @throws {TypeError} if char is not a String
 * @throws {Error} if char is not a sequence of percent encoded character codes
 */
export function fromPctChar(char) {
	if (typeof char !== 'string') throw new TypeError();

	const match = char.match(/^(?:%[A-Fa-f0-9]{2})+$/);

	if (match === null) throw new Error();

	const str = match[0], code = [];

	for (var i = str.length - 2; i > -1; i -= 3) code.unshift(Number.parseInt("0x" + str.substr(i, 2)));

	return fromUtf8CharCode(code);
}

/**
 * Returns a copy of string extended by pattern
 * @param {String} string The source string
 * @param {String} pattern The extension pattern
 * @param {Uint} [length] The extension length
 * @returns {String}
 */
export function extendLeft(string, pattern, length) {
	if (typeof string !== 'string') throw new TypeError();

	return _extendLeft.call(string, pattern, length);
}

/**
 * Returns an Array of utf-8 encoded character codes of string at index
 * @param {String} string The source string
 * @param {Int} index The character index
 * @returns {Array}
 * @throws {TypeError} if string is not a string
 */
export function u8CharCodeAt(string, index) {
	if (typeof string !== 'string') throw new TypeError();

	return _u8CharCodeAt.call(string, index);
}
