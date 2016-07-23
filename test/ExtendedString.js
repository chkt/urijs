import _assert from 'assert';

import String from '../source/ExtendedString';



describe('ExtendedString', () => {
	describe(".fromUtf8CharCode", () => {
		it("should only accept arrays of 8bit integers", () => {
			_assert.throws(() => String.fromUtf8CharCode(), TypeError);
			_assert.throws(() => String.fromUtf8CharCode(null), TypeError);
			_assert.throws(() => String.fromUtf8CharCode(true), TypeError);
			_assert.throws(() => String.fromUtf8CharCode(1), TypeError);
			_assert.throws(() => String.fromUtf8CharCode("1"), TypeError);
			_assert.throws(() => String.fromUtf8CharCode(/^1$/), TypeError);
			_assert.throws(() => String.fromUtf8CharCode(() => 1), TypeError);
			_assert.throws(() => String.fromUtf8CharCode({ "1" : 1 }), TypeError);
			_assert.doesNotThrow(() => String.fromUtf8CharCode([]));

			_assert.throws(() => String.fromUtf8CharCode([ null ]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ true ]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ "1" ]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ /^1$/ ]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ () => 1 ]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ { "1" : 1 } ]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ [ 1 ] ]), Error);

			_assert.doesNotThrow(() => String.fromUtf8CharCode([ 0x0 ]));
			_assert.doesNotThrow(() => String.fromUtf8CharCode([ 0x7f ]));
			_assert.throws(() => String.fromUtf8CharCode([ 0x100 ]), Error);
			_assert.doesNotThrow(() => String.fromUtf8CharCode([ 0x00, 0x7f, 0x7f]));
			_assert.throws(() => String.fromUtf8CharCode([ 0x7f, 0x7f, 0x100 ]));
		});

		it("should only accept correctly encoded character sequences", () => {
			_assert.doesNotThrow(() => String.fromUtf8CharCode([ 0b00000000 ]));
			_assert.doesNotThrow(() => String.fromUtf8CharCode([ 0b01111111 ]));
			_assert.throws(() => String.fromUtf8CharCode([ 0b10111111 ]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ 0b11111011 ]), Error);
			_assert.doesNotThrow(() => String.fromUtf8CharCode([ 0b11000000, 0b10000000]));
			_assert.doesNotThrow(() => String.fromUtf8CharCode([ 0b11011111, 0b10111111]));
			_assert.throws(() => String.fromUtf8CharCode([ 0b11011111 ]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ 0b11011111, 0b00111111 ]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ 0b11011111, 0b11000000 ]), Error);
			_assert.doesNotThrow(() => String.fromUtf8CharCode([ 0b11100000, 0b10000000, 0b10000000 ]));
			_assert.doesNotThrow(() => String.fromUtf8CharCode([ 0b11101111, 0b10111111, 0b10111111 ]));
			_assert.throws(() => String.fromUtf8CharCode([ 0b11101111 ]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ 0b11101111, 0b10111111 ]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ 0b11101111, 0b00111111, 0b10111111]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ 0b11101111, 0b11000000, 0b10111111]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ 0b11101111, 0b10111111, 0b00111111]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ 0b11101111, 0b10111111, 0b11000000]), Error);
			_assert.doesNotThrow(() => String.fromUtf8CharCode([ 0b11110000, 0b10000000, 0b10000000, 0b10000000 ]));
			_assert.doesNotThrow(() => String.fromUtf8CharCode([ 0b11110111, 0b10111111, 0b10111111, 0b10111111 ]));
			_assert.throws(() => String.fromUtf8CharCode([ 0b11110111 ]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ 0b11110111, 0b10111111 ]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ 0b11110111, 0b10111111, 0b10111111 ]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ 0b11110111, 0b00111111, 0b10111111, 0b10111111 ]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ 0b11110111, 0b11000000, 0b10111111, 0b10111111 ]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ 0b11110111, 0b10111111, 0b00111111, 0b10111111 ]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ 0b11110111, 0b10111111, 0b11000000, 0b10111111 ]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ 0b11110111, 0b10111111, 0b10111111, 0b00111111 ]), Error);
			_assert.throws(() => String.fromUtf8CharCode([ 0b11110111, 0b10111111, 0b10111111, 0b11000000 ]), Error);
		});

		it("should return the decoded string", () => {
			_assert.equal(String.fromUtf8CharCode([ 0x20 ]), ' ');
			_assert.equal(String.fromUtf8CharCode([ 0x7e ]), '~');
			_assert.equal(String.fromUtf8CharCode([ 0xc2, 0xa1 ]), '¡');
			_assert.equal(String.fromUtf8CharCode([ 0xc3, 0xbf ]), 'ÿ');
			_assert.equal(String.fromUtf8CharCode([ 0xdf, 0xbf ]), '߿');
			_assert.equal(String.fromUtf8CharCode([ 0xe0, 0xa0, 0x80 ]), 'ࠀ');
			_assert.equal(String.fromUtf8CharCode([ 0xef, 0xbf, 0xbf ]), '￿');
			_assert.equal(String.fromUtf8CharCode([ 0xf0, 0x90, 0x80, 0x80 ]), '𐀀');
			_assert.equal(String.fromUtf8CharCode([ 0xf4, 0x80, 0x8f, 0xbf ]), '􀏿');
			_assert.equal(String.fromUtf8CharCode([ 0xc2, 0xa1, 0xc3, 0xbf, 0x7e]), '¡ÿ~');
		});
	});

	describe('.fromPctChar', () => {
		it("should only accept a percent encoded string", () => {
			_assert.throws(() => String.fromPctChar(), TypeError);
			_assert.throws(() => String.fromPctChar(null), TypeError);
			_assert.throws(() => String.fromPctChar(true), TypeError);
			_assert.throws(() => String.fromPctChar(1), TypeError);
			_assert.throws(() => String.fromPctChar(""), Error);
			_assert.throws(() => String.fromPctChar("1"), Error);
			_assert.doesNotThrow(() => String.fromPctChar("%20"));
			_assert.throws(() => String.fromPctChar(() => 1), TypeError);
			_assert.throws(() => String.fromPctChar({ "1" : 1 }), TypeError);
			_assert.throws(() => String.fromPctChar([ 1 ]), TypeError);
		});

		it("should only accept a correctly percent encoded string", () => {
			 const pct = '%20%7e%7E';

			for (let i = 1, l = pct.length; i < l; i += 1) {
				if (i % 3 === 0) _assert.doesNotThrow(() => String.fromPctChar(pct.substr(0, i)));
				else _assert.throws(() => String.fromPctChar(pct.substr(0, i)), Error);
			}
		});

		it("should return the decoded string", () => {
			_assert.equal(String.fromPctChar("%20"), " ");
			_assert.equal(String.fromPctChar("%25"), "%");
			_assert.equal(String.fromPctChar("%7e"), "~");
			_assert.equal(String.fromPctChar("%c3%bf"), "ÿ");
		});
	});
});
