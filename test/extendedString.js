import _assert from 'assert';

import * as exstr from '../source/extendedString';

import { describe, it } from 'mocha';
import useWith, * as use from 'tesa';



describe("fromUtf8CharCode", () => {
	it("should only accept arrays of 8bit integers", () => {
		_assert.throws(() => exstr.fromUtf8CharCode(), TypeError);
		_assert.throws(() => exstr.fromUtf8CharCode(null), TypeError);
		_assert.throws(() => exstr.fromUtf8CharCode(true), TypeError);
		_assert.throws(() => exstr.fromUtf8CharCode(1), TypeError);
		_assert.throws(() => exstr.fromUtf8CharCode("1"), TypeError);
		_assert.throws(() => exstr.fromUtf8CharCode(/^1$/), TypeError);
		_assert.throws(() => exstr.fromUtf8CharCode(() => 1), TypeError);
		_assert.throws(() => exstr.fromUtf8CharCode({ "1" : 1 }), TypeError);
		_assert.doesNotThrow(() => exstr.fromUtf8CharCode([]));

		_assert.throws(() => exstr.fromUtf8CharCode([ null ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ true ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ "1" ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ /^1$/ ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ () => 1 ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ { "1" : 1 } ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ [ 1 ] ]), Error);

		_assert.doesNotThrow(() => exstr.fromUtf8CharCode([ 0x0 ]));
		_assert.doesNotThrow(() => exstr.fromUtf8CharCode([ 0x7f ]));
		_assert.throws(() => exstr.fromUtf8CharCode([ 0x100 ]), Error);
		_assert.doesNotThrow(() => exstr.fromUtf8CharCode([ 0x00, 0x7f, 0x7f]));
		_assert.throws(() => exstr.fromUtf8CharCode([ 0x7f, 0x7f, 0x100 ]));
	});

	it("should only accept correctly encoded character sequences", () => {
		_assert.doesNotThrow(() => exstr.fromUtf8CharCode([ 0b00000000 ]));
		_assert.doesNotThrow(() => exstr.fromUtf8CharCode([ 0b01111111 ]));

		_assert.throws(() => exstr.fromUtf8CharCode([ 0b10111111 ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11111011 ]), Error);

		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11000000, 0b10000000 ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11000000, 0b10111111 ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11000001, 0b10000000 ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11000001, 0b10111111 ]), Error);
		_assert.doesNotThrow(() => exstr.fromUtf8CharCode([ 0b11000010, 0b10000000] ));
		_assert.doesNotThrow(() => exstr.fromUtf8CharCode([ 0b11011111, 0b10111111]));

		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11011111 ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11011111, 0b00111111 ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11011111, 0b11000000 ]), Error);

		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11100000, 0b10000000, 0b10000000 ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11100000, 0b10011111, 0b10111111 ]), Error);
		_assert.doesNotThrow(() => exstr.fromUtf8CharCode([ 0b11100000, 0b10100000, 0b10000000 ]));
		_assert.doesNotThrow(() => exstr.fromUtf8CharCode([ 0b11100000, 0b10111111, 0b10111111 ]));
		_assert.doesNotThrow(() => exstr.fromUtf8CharCode([ 0b11100001, 0b10000000, 0b10000000 ]));
		_assert.doesNotThrow(() => exstr.fromUtf8CharCode([ 0b11101111, 0b10111111, 0b10111111 ]));

		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11101111 ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11101111, 0b10111111 ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11101111, 0b00111111, 0b10111111]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11101111, 0b11000000, 0b10111111]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11101111, 0b10111111, 0b00111111]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11101111, 0b10111111, 0b11000000]), Error);

		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11110000, 0b10000000, 0b10000000, 0b10000000 ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11110000, 0b10001111, 0b10111111, 0b10111111 ]), Error);
		_assert.doesNotThrow(() => exstr.fromUtf8CharCode([ 0b11110000, 0b10010000, 0b10000000, 0b10000000 ]));
		_assert.doesNotThrow(() => exstr.fromUtf8CharCode([ 0b11110000, 0b10111111, 0b10111111, 0b10111111 ]));
		_assert.doesNotThrow(() => exstr.fromUtf8CharCode([ 0b11110001, 0b10000000, 0b10000000, 0b10000000 ]));
		_assert.doesNotThrow(() => exstr.fromUtf8CharCode([ 0b11110100, 0b10001111, 0b10111111, 0b10111111 ]));
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11110100, 0b10010000, 0b10000000, 0b10000000 ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11110111, 0b10111111, 0b10111111, 0b10111111 ]), Error);

		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11110111 ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11110111, 0b10111111 ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11110111, 0b10111111, 0b10111111 ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11110111, 0b00111111, 0b10111111, 0b10111111 ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11110111, 0b11000000, 0b10111111, 0b10111111 ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11110111, 0b10111111, 0b00111111, 0b10111111 ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11110111, 0b10111111, 0b11000000, 0b10111111 ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11110111, 0b10111111, 0b10111111, 0b00111111 ]), Error);
		_assert.throws(() => exstr.fromUtf8CharCode([ 0b11110111, 0b10111111, 0b10111111, 0b11000000 ]), Error);
	});

	it("should return the decoded string", () => {
		_assert.equal(exstr.fromUtf8CharCode([ 0x20 ]), ' ');
		_assert.equal(exstr.fromUtf8CharCode([ 0x7e ]), '~');
		_assert.equal(exstr.fromUtf8CharCode([ 0xc2, 0xa1 ]), '¡');
		_assert.equal(exstr.fromUtf8CharCode([ 0xc3, 0xbf ]), 'ÿ');
		_assert.equal(exstr.fromUtf8CharCode([ 0xdf, 0xbf ]), '߿');
		_assert.equal(exstr.fromUtf8CharCode([ 0xe0, 0xa0, 0x80 ]), 'ࠀ');
		_assert.equal(exstr.fromUtf8CharCode([ 0xef, 0xbf, 0xbf ]), '￿');
		_assert.equal(exstr.fromUtf8CharCode([ 0xf0, 0x90, 0x80, 0x80 ]), '𐀀');
		_assert.equal(exstr.fromUtf8CharCode([ 0xf4, 0x80, 0x8f, 0xbf ]), '􀏿');
		_assert.equal(exstr.fromUtf8CharCode([ 0xc2, 0xa1, 0xc3, 0xbf, 0x7e]), '¡ÿ~');
	});
});

describe('fromPctChar', () => {
	it("should only accept a percent encoded string", () => {
		_assert.throws(() => exstr.fromPctChar(), TypeError);
		_assert.throws(() => exstr.fromPctChar(null), TypeError);
		_assert.throws(() => exstr.fromPctChar(true), TypeError);
		_assert.throws(() => exstr.fromPctChar(1), TypeError);
		_assert.throws(() => exstr.fromPctChar(""), Error);
		_assert.throws(() => exstr.fromPctChar("1"), Error);
		_assert.doesNotThrow(() => exstr.fromPctChar("%20"));
		_assert.throws(() => exstr.fromPctChar(() => 1), TypeError);
		_assert.throws(() => exstr.fromPctChar({ "1" : 1 }), TypeError);
		_assert.throws(() => exstr.fromPctChar([ 1 ]), TypeError);
	});

	it("should only accept a correctly percent encoded string", () => {
		 const pct = '%20%7e%7E';

		for (let i = 1, l = pct.length; i < l; i += 1) {
			if (i % 3 === 0) _assert.doesNotThrow(() => exstr.fromPctChar(pct.substr(0, i)));
			else _assert.throws(() => exstr.fromPctChar(pct.substr(0, i)), Error);
		}
	});

	it("should return the decoded string", () => {
		_assert.equal(exstr.fromPctChar("%20"), " ");
		_assert.equal(exstr.fromPctChar("%25"), "%");
		_assert.equal(exstr.fromPctChar("%7e"), "~");
		_assert.equal(exstr.fromPctChar("%c3%bf"), "ÿ");
	});
});

describe('extendLeft', () => {
	it("should expect a string as first and a nonempty string as second argument", () => {
		_assert.throws(() => exstr.extendLeft(), TypeError);
		_assert.throws(() => exstr.extendLeft(null, "1"), TypeError);
		_assert.throws(() => exstr.extendLeft(true, "1"), TypeError);
		_assert.throws(() => exstr.extendLeft(1, "1"), TypeError);
		_assert.doesNotThrow(() => exstr.extendLeft("", "1"));
		_assert.doesNotThrow(() => exstr.extendLeft("1", "1"));
		_assert.throws(() => exstr.extendLeft(/^1$/, "1"), TypeError);
		_assert.throws(() => exstr.extendLeft(() => 1, "1"), TypeError);
		_assert.throws(() => exstr.extendLeft({ "1" : 1 }, "1"), TypeError);
		_assert.throws(() => exstr.extendLeft("1", null), TypeError);
		_assert.throws(() => exstr.extendLeft("1", true), TypeError);
		_assert.throws(() => exstr.extendLeft("1", 1), TypeError);
		_assert.throws(() => exstr.extendLeft("1", ""), TypeError);
		_assert.throws(() => exstr.extendLeft("1", /^1$/), TypeError);
		_assert.throws(() => exstr.extendLeft("1", () => 1), TypeError);
		_assert.throws(() => exstr.extendLeft("1", { "1" : 1 }), TypeError);
	});

	it("should optionally accept a positive integer as third argument", () => {
		_assert.throws(() => exstr.extendLeft("1", "1", null), TypeError);
		_assert.throws(() => exstr.extendLeft("1", "1", true), TypeError);
		_assert.throws(() => exstr.extendLeft("1", "1", -1), TypeError);
		_assert.doesNotThrow(() => exstr.extendLeft("1", "1", 0));
		_assert.doesNotThrow(() => exstr.extendLeft("1", "1", 1));
		_assert.doesNotThrow(() => exstr.extendLeft("1", "1", 1024 * 1024));
		_assert.throws(() => exstr.extendLeft("1", "1", 0.1), TypeError);
		_assert.throws(() => exstr.extendLeft("1", "1", Number.NaN), TypeError);
		_assert.throws(() => exstr.extendLeft("1", "1", "1"), TypeError);
		_assert.throws(() => exstr.extendLeft("1", "1", /^1$/), TypeError);
		_assert.throws(() => exstr.extendLeft("1", "1", () => 1), TypeError);
		_assert.throws(() => exstr.extendLeft("1", "1", { "1" : 1 }), TypeError);
	});

	it("should return a string that is the first string padded by the second string", () => {
		_assert.strictEqual(exstr.extendLeft("", "0x00"), "0x00");
		_assert.strictEqual(exstr.extendLeft("1", "0x00"), "0x01");
		_assert.strictEqual(exstr.extendLeft("1", "2"), "1");
		_assert.strictEqual(exstr.extendLeft("12", "1"), "12");
		_assert.strictEqual(exstr.extendLeft("12", "1", 2), "12");
		_assert.strictEqual(exstr.extendLeft("12", "1", 3), "112");
		_assert.strictEqual(exstr.extendLeft("", "123", 1), "1");
		_assert.strictEqual(exstr.extendLeft("", "123", 2), "12");
		_assert.strictEqual(exstr.extendLeft("", "123", 3), "123");
		_assert.strictEqual(exstr.extendLeft("", "123", 4), "1231");
	});
});

describe('extendRight', () => {
	it("should require as string as first,a nonempty string as second and a positive integer as optional third argument", () => {
		useWith(
			[ use.TYPE_STRING ],
			[ use.TYPE_STRING_NONEMPTY ],
			[ use.TYPE_UNDEFINED, use.TYPE_NUMBER_INT_POS_24 ],
			(first, second, third) => exstr.extendRight(first, second, third)
		);
	});

	it("should return a string that is the first string padded by the second string", () => {
		_assert.strictEqual(exstr.extendRight("", "1234"), "1234");
		_assert.strictEqual(exstr.extendRight("x", "1234"), "x234");
		_assert.strictEqual(exstr.extendRight("x", "1"), "x");
		_assert.strictEqual(exstr.extendRight("xx", "1"), "xx");
		_assert.strictEqual(exstr.extendRight("xx", "1", 2), "xx");
		_assert.strictEqual(exstr.extendRight("xx", "1", 3), "xx1");
		_assert.strictEqual(exstr.extendRight("", "123", 1), "3");
		_assert.strictEqual(exstr.extendRight("", "123", 2), "23");
		_assert.strictEqual(exstr.extendRight("", "123", 3), "123");
		_assert.strictEqual(exstr.extendRight("", "123", 4), "3123");
	});
});

describe('u8CharCodeAt', () => {
	it("should expect a string and an integer as arguments", () => {
		_assert.throws(() => exstr.u8CharCodeAt(), TypeError);
		_assert.throws(() => exstr.u8CharCodeAt("1"), TypeError);
		_assert.throws(() => exstr.u8CharCodeAt(null, 0), TypeError);
		_assert.throws(() => exstr.u8CharCodeAt(true, 0), TypeError);
		_assert.throws(() => exstr.u8CharCodeAt(1, 0), TypeError);
		_assert.doesNotThrow(() => exstr.u8CharCodeAt("1", 0));
		_assert.throws(() => exstr.u8CharCodeAt(() => 1, 0), TypeError);
		_assert.throws(() => exstr.u8CharCodeAt({ "1" : 1 }, 0), TypeError);
		_assert.throws(() => exstr.u8CharCodeAt("1"), TypeError);
		_assert.throws(() => exstr.u8CharCodeAt("1", null), TypeError);
		_assert.throws(() => exstr.u8CharCodeAt("1", true), TypeError);
		_assert.throws(() => exstr.u8CharCodeAt("1", 0.1), TypeError);
		_assert.throws(() => exstr.u8CharCodeAt("1", NaN), TypeError);
		_assert.throws(() => exstr.u8CharCodeAt("1", "1"), TypeError);
		_assert.throws(() => exstr.u8CharCodeAt("1", () => 1), TypeError);
		_assert.throws(() => exstr.u8CharCodeAt("1", { "1" : 1 }), TypeError);
	});

	it("should only accept index arguments that are within the length of string", () => {
		_assert.throws(() => exstr.u8CharCodeAt("string", -1), RangeError);
		_assert.throws(() => exstr.u8CharCodeAt("string", 6), RangeError);
		_assert.doesNotThrow(() => exstr.u8CharCodeAt("string", 0));
		_assert.doesNotThrow(() => exstr.u8CharCodeAt("string", 5));
	});

	it("should return an array of utf8 character codes for the character at index", () => {
		_assert.deepEqual(exstr.u8CharCodeAt(" ", 0), [ 0x20 ]);
		_assert.deepEqual(exstr.u8CharCodeAt("~", 0), [ 0x7e ]);
		_assert.deepEqual(exstr.u8CharCodeAt('¡', 0), [ 0xc2, 0xa1 ]);
		_assert.deepEqual(exstr.u8CharCodeAt('ÿ', 0), [ 0xc3, 0xbf ]);
		_assert.deepEqual(exstr.u8CharCodeAt('߿', 0), [ 0xdf, 0xbf ]);
		_assert.deepEqual(exstr.u8CharCodeAt('ࠀ', 0), [ 0xe0, 0xa0, 0x80 ]);
		_assert.deepEqual(exstr.u8CharCodeAt('￿', 0), [ 0xef, 0xbf, 0xbf ]);
		_assert.deepEqual(exstr.u8CharCodeAt('𐀀', 0), [ 0xf0, 0x90, 0x80, 0x80 ]);
		_assert.deepEqual(exstr.u8CharCodeAt('􀏿', 0), [ 0xf4, 0x80, 0x8f, 0xbf ]);
	});

	it("should return the inverse of fromUtf8CharCode", () => {
		_assert.deepEqual(exstr.u8CharCodeAt(exstr.fromUtf8CharCode([ 0b00000000 ]), 0), [ 0b00000000 ]);
		_assert.deepEqual(exstr.u8CharCodeAt(exstr.fromUtf8CharCode([ 0b01111111 ]), 0), [ 0b01111111 ]);
		_assert.deepEqual(exstr.u8CharCodeAt(exstr.fromUtf8CharCode([ 0b11000010, 0b10000000 ]), 0), [ 0b11000010, 0b10000000 ]);
		_assert.deepEqual(exstr.u8CharCodeAt(exstr.fromUtf8CharCode([ 0b11011111, 0b10111111 ]), 0), [ 0b11011111, 0b10111111 ]);
		_assert.deepEqual(exstr.u8CharCodeAt(exstr.fromUtf8CharCode([ 0b11100000, 0b10100000, 0b10000000 ]), 0), [ 0b11100000, 0b10100000, 0b10000000 ]);
		_assert.deepEqual(exstr.u8CharCodeAt(exstr.fromUtf8CharCode([ 0b11101111, 0b10111111, 0b10111111 ]), 0), [ 0b11101111, 0b10111111, 0b10111111 ]);
		_assert.deepEqual(exstr.u8CharCodeAt(exstr.fromUtf8CharCode([ 0b11110000, 0b10010000, 0b10000000, 0b10000000 ]), 0), [ 0b11110000, 0b10010000, 0b10000000, 0b10000000 ]);
 		_assert.deepEqual(exstr.u8CharCodeAt(exstr.fromUtf8CharCode([ 0b11110100, 0b10001111, 0b10111111, 0b10111111 ]), 0), [ 0b11110100, 0b10001111, 0b10111111, 0b10111111 ]);
	});
});

describe('pctCharAt', () => {
	it("should expect a string and an integer as arguments", () => {
		_assert.throws(() => exstr.pctCharAt(), TypeError);
		_assert.throws(() => exstr.pctCharAt("1"), TypeError);
		_assert.throws(() => exstr.pctCharAt(null, 0), TypeError);
		_assert.throws(() => exstr.pctCharAt(true, 0), TypeError);
		_assert.throws(() => exstr.pctCharAt(1, 0), TypeError);
		_assert.doesNotThrow(() => exstr.pctCharAt("1", 0));
		_assert.throws(() => exstr.pctCharAt(() => 1, 0), TypeError);
		_assert.throws(() => exstr.pctCharAt({ "1" : 1 }, 0), TypeError);
		_assert.throws(() => exstr.pctCharAt("1"), TypeError);
		_assert.throws(() => exstr.pctCharAt("1", null), TypeError);
		_assert.throws(() => exstr.pctCharAt("1", true), TypeError);
		_assert.throws(() => exstr.pctCharAt("1", 0.1), TypeError);
		_assert.throws(() => exstr.pctCharAt("1", NaN), TypeError);
		_assert.throws(() => exstr.pctCharAt("1", "1"), TypeError);
		_assert.throws(() => exstr.pctCharAt("1", () => 1), TypeError);
		_assert.throws(() => exstr.pctCharAt("1", { "1" : 1 }), TypeError);
	});

	it("should only accept index arguments within the length of string", () => {
		_assert.throws(() => exstr.pctCharAt("string", -1), RangeError);
		_assert.throws(() => exstr.pctCharAt("string", 6), RangeError);
		_assert.doesNotThrow(() => exstr.pctCharAt("string", 0));
		_assert.doesNotThrow(() => exstr.pctCharAt("string", 5));
	});

	it("should return a string of percent encoded utf8 code points", () => {
		_assert.deepEqual(exstr.pctCharAt(" ", 0), "%20");
		_assert.deepEqual(exstr.pctCharAt("~", 0), "%7E");
		_assert.deepEqual(exstr.pctCharAt('¡', 0), "%C2%A1");
		_assert.deepEqual(exstr.pctCharAt('ÿ', 0), "%C3%BF");
		_assert.deepEqual(exstr.pctCharAt('߿', 0), "%DF%BF");
		_assert.deepEqual(exstr.pctCharAt('ࠀ', 0), "%E0%A0%80");
		_assert.deepEqual(exstr.pctCharAt('￿', 0), "%EF%BF%BF");
		_assert.deepEqual(exstr.pctCharAt('𐀀', 0), "%F0%90%80%80");
		_assert.deepEqual(exstr.pctCharAt('􀏿', 0), "%F4%80%8F%BF");
	});

	it("should return the inverse of fromPctChar", () => {
		_assert.deepEqual(exstr.pctCharAt(exstr.fromPctChar("%00"), 0), "%00");
		_assert.deepEqual(exstr.pctCharAt(exstr.fromPctChar("%7F"), 0), "%7F");
		_assert.deepEqual(exstr.pctCharAt(exstr.fromPctChar("%C2%80"), 0), "%C2%80");
		_assert.deepEqual(exstr.pctCharAt(exstr.fromPctChar("%DF%BF"), 0), "%DF%BF");
		_assert.deepEqual(exstr.pctCharAt(exstr.fromPctChar("%E0%A0%80"), 0), "%E0%A0%80");
		_assert.deepEqual(exstr.pctCharAt(exstr.fromPctChar("%EF%BF%BF"), 0), "%EF%BF%BF");
		_assert.deepEqual(exstr.pctCharAt(exstr.fromPctChar("%F0%90%80%80"), 0), "%F0%90%80%80");
		_assert.deepEqual(exstr.pctCharAt(exstr.fromPctChar("%F4%8F%BF%BF"), 0), "%F4%8F%BF%BF");
	});
});

describe('toU8CharCodes', () => {
	it("should expect a string as sole argument", () => {
		_assert.throws(() => exstr.toU8CharCodes(), TypeError);
		_assert.throws(() => exstr.toU8CharCodes(null), TypeError);
		_assert.throws(() => exstr.toU8CharCodes(true), TypeError);
		_assert.doesNotThrow(() => exstr.toU8CharCodes(""));
		_assert.doesNotThrow(() => exstr.toU8CharCodes("1"));
		_assert.throws(() => exstr.toU8CharCodes(1), TypeError);
		_assert.throws(() => exstr.toU8CharCodes(() => 1), TypeError);
		_assert.throws(() => exstr.toU8CharCodes({ "1" : 1 }), TypeError);
	});

	it("should return an array of utf8 character codes", () => {
		_assert.deepStrictEqual(exstr.toU8CharCodes("¡ÿ𐀀~"), [ 0xc2, 0xa1, 0xc3, 0xbf, 0xf0, 0x90, 0x80, 0x80, 0x7e]);
	});

	it("should return the inverse of fromUtf8CharCode", () => {
		_assert.strictEqual(exstr.fromUtf8CharCode(exstr.toU8CharCodes(' ')), ' ');
		_assert.strictEqual(exstr.fromUtf8CharCode(exstr.toU8CharCodes('~')), '~');
		_assert.strictEqual(exstr.fromUtf8CharCode(exstr.toU8CharCodes('¡')), '¡');
		_assert.strictEqual(exstr.fromUtf8CharCode(exstr.toU8CharCodes('ÿ')), 'ÿ');
		_assert.strictEqual(exstr.fromUtf8CharCode(exstr.toU8CharCodes('߿')), '߿');
		_assert.strictEqual(exstr.fromUtf8CharCode(exstr.toU8CharCodes('ࠀ')), 'ࠀ');
		_assert.strictEqual(exstr.fromUtf8CharCode(exstr.toU8CharCodes('𐀀')), '𐀀');
		_assert.strictEqual(exstr.fromUtf8CharCode(exstr.toU8CharCodes('􀏿')), '􀏿');
		_assert.strictEqual(exstr.fromUtf8CharCode(exstr.toU8CharCodes('¡ÿ~')), '¡ÿ~');
	});
});

describe('toPctChars', () => {
	it("should expect a string a sole argument", () => {
		_assert.throws(() => exstr.toU8CharCodes(), TypeError);
		_assert.throws(() => exstr.toU8CharCodes(null), TypeError);
		_assert.throws(() => exstr.toU8CharCodes(true), TypeError);
		_assert.doesNotThrow(() => exstr.toU8CharCodes(""));
		_assert.doesNotThrow(() => exstr.toU8CharCodes("1"));
		_assert.throws(() => exstr.toU8CharCodes(1), TypeError);
		_assert.throws(() => exstr.toU8CharCodes(() => 1), TypeError);
		_assert.throws(() => exstr.toU8CharCodes({ "1" : 1 }), TypeError);
	});

	it("should return a string of percent encoded utf8 characters", () => {
		_assert.strictEqual(exstr.toPctChars("¡ÿ𐀀~"), "%C2%A1%C3%BF%F0%90%80%80%7E");
	});

	it("should return the inverse of fromPctChar", () => {
		_assert.strictEqual(exstr.fromPctChar(exstr.toPctChars(' ')), ' ');
		_assert.strictEqual(exstr.fromPctChar(exstr.toPctChars('~')), '~');
		_assert.strictEqual(exstr.fromPctChar(exstr.toPctChars('¡')), '¡');
		_assert.strictEqual(exstr.fromPctChar(exstr.toPctChars('ÿ')), 'ÿ');
		_assert.strictEqual(exstr.fromPctChar(exstr.toPctChars('߿')), '߿');
		_assert.strictEqual(exstr.fromPctChar(exstr.toPctChars('ࠀ')), 'ࠀ');
		_assert.strictEqual(exstr.fromPctChar(exstr.toPctChars('𐀀')), '𐀀');
		_assert.strictEqual(exstr.fromPctChar(exstr.toPctChars('􀏿')), '􀏿');
		_assert.strictEqual(exstr.fromPctChar(exstr.toPctChars('¡ÿ~')), '¡ÿ~');
	});
});
