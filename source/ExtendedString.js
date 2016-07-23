export default class ExtendedString extends String {

	/**
	 * Returns an instance created from utf-8 encoded character codes
	 * @param {Uint[]} char
	 * @returns {String}
	 * @throws {TypeError} if char is not an Array
	 * @throws {Error} if char is not a valid sequence of utf-8 encoded character codes
	 */
	static fromUtf8CharCode(char) {
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

			i += f;

			if (code < 0x010000) res += String.fromCharCode(code);
			else {
				code -= 0x010000;
				res += String.fromCharCode(0xD800 | (code & 0x0FFC00) >> 10, 0xDC00 | code & 0x0003FF);
			}
		}

		return res;
	}
}
