import _assert from 'assert';

import URIComponent from '../source/URIComponent';
import * as component from '../source/URIComponent';

import * as exstr from '../source/extendedString';
import generator from '../source/characterGenerator';
import * as gen from '../source/characterGenerator';


const CTRL_CHARS =
	"\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008\u0009\u000a\u000b\u000c\u000d\u000e\u000f" +
	"\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f" +
	"\u007f";

const UNICODE_CHARS = "¡ÿ";



function _testChars(ins, gen) {
	for (let item in gen) {
		if (item.valid) _assert.doesNotThrow(() => ins.string = item.string);
		else _assert.throws(() => ins.string = item.string, Error);
	}
}

function _testSetDecode(ins, lower = false) {
	const decoded = "-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~";
	const encoded = exstr.toPctChars(decoded);

	ins.string = encoded;

	_assert.strictEqual(ins.string, lower ? decoded.toLowerCase() : decoded);
}

function _testSetPreserve(ins, string) {
	ins.string = string;

	_assert.strictEqual(ins.string, string);
}

function _testSetEncode(ins, string) {
	const encoded = exstr.toPctChars(string);

	ins.string = string;

	_assert.strictEqual(ins.string, encoded);
}

function _testSetEntity(ins) {
	const encoded = '%8A%8B%8C%8D%8E%8F%A0%B0%C0%D0%E0%F0';

	ins.string = encoded.toLowerCase();

	_assert.strictEqual(ins.string, encoded);
}



describe('URIComponent', () => {
	describe('.ComponentString', () => {
		it("should require a valid component type as first argument", () => {
			_assert.throws(() => URIComponent.ComponentString(), TypeError);
			_assert.throws(() => URIComponent.ComponentString(null), TypeError);
			_assert.throws(() => URIComponent.ComponentString(true), TypeError);
			_assert.throws(() => URIComponent.ComponentString(0), TypeError);
			_assert.throws(() => URIComponent.ComponentString(8), TypeError);
			_assert.throws(() => URIComponent.ComponentString("1"), TypeError);
			_assert.throws(() => URIComponent.ComponentString(/^1$/), TypeError);
			_assert.throws(() => URIComponent.ComponentString(() => 1), TypeError);
			_assert.throws(() => URIComponent.ComponentString({ "1" : 1 }), TypeError);
			_assert.doesNotThrow(() => URIComponent.ComponentString(component.TYPE_SCHEME));
			_assert.doesNotThrow(() => URIComponent.ComponentString(component.TYPE_USER));
			_assert.doesNotThrow(() => URIComponent.ComponentString(component.TYPE_NAME));
			_assert.doesNotThrow(() => URIComponent.ComponentString(component.TYPE_PORT));
			_assert.doesNotThrow(() => URIComponent.ComponentString(component.TYPE_PATH));
			_assert.doesNotThrow(() => URIComponent.ComponentString(component.TYPE_QUERY));
			_assert.doesNotThrow(() => URIComponent.ComponentString(component.TYPE_FRAGMENT));
		});

		it("should accept a string as optional second argument", () => {
			_assert.throws(() => URIComponent.ComponentString(component.TYPE_PATH, null), TypeError);
			_assert.throws(() => URIComponent.ComponentString(component.TYPE_PATH, true), TypeError);
			_assert.throws(() => URIComponent.ComponentString(component.TYPE_PATH, 1), TypeError);
			_assert.doesNotThrow(() => URIComponent.ComponentString(component.TYPE_PATH, ""));
			_assert.doesNotThrow(() => URIComponent.ComponentString(component.TYPE_PATH, "1"));
			_assert.throws(() => URIComponent.ComponentString(component.TYPE_PATH, /^1$/), TypeError);
			_assert.throws(() => URIComponent.ComponentString(component.TYPE_PATH, () => 1), TypeError);
			_assert.throws(() => URIComponent.ComponentString(component.TYPE_PATH, { "1" : 1 }), TypeError);
		});

		it("should return an initialized instance", () => {
			const ins = URIComponent.ComponentString(component.TYPE_PATH, "1");

			_assert(ins instanceof URIComponent);
			_assert.strictEqual(ins.type, component.TYPE_PATH);
			_assert.strictEqual(ins.string, "1");
		});

		it("should accept an URIComponent as optional third argument", () => {
			const ins = new URIComponent(component.TYPE_SCHEME);

			_assert.throws(() => URIComponent.ComponentString(component.TYPE_PATH, "1", null), TypeError);
			_assert.throws(() => URIComponent.ComponentString(component.TYPE_PATH, "1", true), TypeError);
			_assert.throws(() => URIComponent.ComponentString(component.TYPE_PATH, "1", 1), TypeError);
			_assert.throws(() => URIComponent.ComponentString(component.TYPE_PATH, "1", "1"), TypeError);
			_assert.throws(() => URIComponent.ComponentString(component.TYPE_PATH, "1", /^1$/), TypeError);
			_assert.throws(() => URIComponent.ComponentString(component.TYPE_PATH, "1", () => 1), TypeError);
			_assert.throws(() => URIComponent.ComponentString(component.TYPE_PATH, "1", { "1" : 1 }), TypeError);
			_assert.throws(() => URIComponent.ComponentString(component.TYPE_PATH, "1", [ 1 ]), TypeError);
			_assert.doesNotThrow(() => URIComponent.ComponentString(component.TYPE_PATH, "1", ins));
		});

		it("should return the reinitialized third argument if provided", () => {
			const ins = new URIComponent(component.TYPE_SCHEME);

			_assert.strictEqual(URIComponent.ComponentString(component.TYPE_PATH, "1", ins), ins);
		});
	});

	describe('.URIString', () => {
		it("should return an initialized instance");
		it("should require a valid component type as first argument");
		it("should require a valid uri string as second argument");
		it("should accept an URIComponent as optional third argument");
		it("should return the reinitialized third argument if provided");
	});

	describe(".copy", () => {
		it("should require an URIComponent as first argument");
		it("should return an initialized URIComponent as a copy of the first argument");
		it("should accept an URIComponent as optional second argument");
		it("should return the second argument if provided");
	});

	describe(".isEQ", () => {
		it("should require URIComponents as first and second argument");
		it("should return true if both URIComponents have the same type and encoded string");
	});

	describe('#constructor', () => {
		it("should require a valid component type as first argument", () => {
			_assert.throws(() => new URIComponent(), TypeError);
			_assert.throws(() => new URIComponent(null), TypeError);
			_assert.throws(() => new URIComponent(true), TypeError);
			_assert.throws(() => new URIComponent(0), TypeError);
			_assert.throws(() => new URIComponent(8), TypeError);
			_assert.throws(() => new URIComponent("1"), TypeError);
			_assert.throws(() => new URIComponent(/^1$/), TypeError);
			_assert.throws(() => new URIComponent(() => 1), TypeError);
			_assert.throws(() => new URIComponent({ "1" : 1 }), TypeError);
			_assert.doesNotThrow(() => new URIComponent(component.TYPE_SCHEME));
			_assert.doesNotThrow(() => new URIComponent(component.TYPE_USER));
			_assert.doesNotThrow(() => new URIComponent(component.TYPE_NAME));
			_assert.doesNotThrow(() => new URIComponent(component.TYPE_PORT));
			_assert.doesNotThrow(() => new URIComponent(component.TYPE_PATH));
			_assert.doesNotThrow(() => new URIComponent(component.TYPE_QUERY));
			_assert.doesNotThrow(() => new URIComponent(component.TYPE_FRAGMENT));
		});

		it("should accept a string as optional second argument", () => {
			_assert.throws(() => new URIComponent(component.TYPE_PATH, null), TypeError);
			_assert.throws(() => new URIComponent(component.TYPE_PATH, true), TypeError);
			_assert.throws(() => new URIComponent(component.TYPE_PATH, 1), TypeError);
			_assert.doesNotThrow(() => new URIComponent(component.TYPE_PATH, ""));
			_assert.doesNotThrow(() => new URIComponent(component.TYPE_PATH, "1"));
			_assert.throws(() => new URIComponent(component.TYPE_PATH, /^1$/), TypeError);
			_assert.throws(() => new URIComponent(component.TYPE_PATH, () => 1), TypeError);
			_assert.throws(() => new URIComponent(component.TYPE_PATH, { "1" : 1 }), TypeError);
		});

		it("should create a new instance", () => {
			_assert(new URIComponent(component.TYPE_SCHEME) instanceof URIComponent);
			_assert(new URIComponent(component.TYPE_PATH, "1") instanceof URIComponent);
		});
	});

	describe('#type', () => {
		it("should get the component type of the instance", () => {
			_assert.strictEqual(new URIComponent(component.TYPE_SCHEME).type, component.TYPE_SCHEME);
			_assert.strictEqual(new URIComponent(component.TYPE_USER).type, component.TYPE_USER);
			_assert.strictEqual(new URIComponent(component.TYPE_NAME).type, component.TYPE_NAME);
			_assert.strictEqual(new URIComponent(component.TYPE_PORT).type, component.TYPE_PORT);
			_assert.strictEqual(new URIComponent(component.TYPE_PATH).type, component.TYPE_PATH);
			_assert.strictEqual(new URIComponent(component.TYPE_QUERY).type, component.TYPE_QUERY);
			_assert.strictEqual(new URIComponent(component.TYPE_FRAGMENT).type, component.TYPE_FRAGMENT);
		});
		it("should not be settable", () => {
			const ins = new URIComponent(component.TYPE_SCHEME);

			_assert.throws(() => ins.type = component.TYPE_SCHEME);
		});
	});

	describe('#string', () => {
		it("should get the encoded component", () => {
			const ins = new URIComponent(component.TYPE_PATH, "1");

			_assert.strictEqual(ins.string, "1");
		});

		it("should set the encoded component", () => {
			const ins = new URIComponent(component.TYPE_PATH);

			_assert.strictEqual(ins.string, "");

			ins.string = "1";

			_assert.strictEqual(ins.string, "1");
		});

		it("should allow setting empty components when component type is scheme", () => {
			const ins = new URIComponent(component.TYPE_SCHEME);

			_assert.doesNotThrow(() => ins.string = "");
		});

		it("should only set valid scheme components when component type is scheme", () => {
			const ins = new URIComponent(component.TYPE_SCHEME);
			const valid = [[
				gen.FLAG_ALPHA
			], [
				gen.FLAG_ALPHA,
				gen.FLAG_DIGIT,
				gen.PLUS,
				gen.HYPH,
				gen.DOT
			]];

			_testChars(ins, generator(valid, 0.01, 1, 3));
		});

		it("should correctly encode scheme components when component type is scheme", () => {
			const ins = new URIComponent(component.TYPE_SCHEME);
			const str = 'abcdefghijklmnopqrstuvwxyz';

			ins.string = str.toUpperCase();

			_assert.strictEqual(ins.string, str);
		});

		it("should allow setting empty components when component type is user", () => {
			const ins = new URIComponent(component.TYPE_USER);

			_assert.doesNotThrow(() => ins.string = "");
		})

		it("should only set valid user components when component type is user", () => {
			const ins = new URIComponent(component.TYPE_USER);
			const valid = [[
				gen.FLAG_ENCODE,
				gen.FLAG_PRESERVE,
				gen.FLAG_DELIMITER
			]];

			_testChars(ins, generator(valid, 0.1, 1, 2));
		});

		it("should correctly encode user components when component type is user", () => {
			const ins = new URIComponent(component.TYPE_USER);

			_testSetDecode(ins);
			_testSetPreserve(ins, "!%21$%24&%26'%27(%28)%29*%2A+%2B,%2C:%3A;%3B=%3D");
			_testSetEncode(ins, ` "#/<>?@[\\]^\`{|}${ CTRL_CHARS }${ UNICODE_CHARS }`);
			_testSetEntity(ins);
		});

		it("should allow setting empty components when component type is name", () => {
			const ins = new URIComponent(component.TYPE_NAME);

			_assert.doesNotThrow(() => ins.string = "");
		});

		it("should only set valid name components when component type is name", () => {
			const ins = new URIComponent(component.TYPE_NAME);
			const valid = [[
				gen.FLAG_ENCODE,
				gen.FLAG_PRESERVE,
				gen.FLAG_DELIMITER
			]];

			_testChars(ins, generator(valid, 0.1, 1, 2));
		});

		it("should correctly encode name components when component type is name", () => {
			const ins = new URIComponent(component.TYPE_NAME);

			_testSetDecode(ins, true);
			_testSetPreserve(ins, "!%21$%24&%26'%27(%28)%29*%2A+%2B,%2C;%3B=%3D");
			_testSetEncode(ins, ` "#/:<>?@[\\]^\`{|}${ CTRL_CHARS }${ UNICODE_CHARS }`);
			_testSetEntity(ins);
		});

		it("should allow setting empty components when component type is port", () => {
			const ins = new URIComponent(component.TYPE_PORT);

			_assert.doesNotThrow(() => ins.string = "");
		});

		it("should only set valid port components when component type is port", () => {
			const ins = new URIComponent(component.TYPE_PORT);
			const valid = [[
				gen.FLAG_DIGIT
			]];

			_testChars(ins, generator(valid, 0.1, 1, 2));
		});

		it("should allow setting empty components when component type is path", () => {
			const ins = new URIComponent(component.TYPE_PATH);

			_assert.doesNotThrow(() => ins.string = "");
		});

		it("should only set valid path components when component type is path", () => {
			const ins = new URIComponent(component.TYPE_PATH);
			const valid = [[
				gen.FLAG_ENCODE,
				gen.FLAG_PRESERVE,
				gen.FLAG_DELIMITER
			]];

			_testChars(ins, generator(valid, 0.1, 1, 2));
		});

		it("should correctly encode path components when component type is path", () => {
			const ins = new URIComponent(component.TYPE_PATH);

			_testSetDecode(ins);
			_testSetPreserve(ins, "!%21$%24&%26'%27(%28)%29*%2A+%2B,%2C/%2F:%3A;%3B=%3D@%40");
			_testSetEncode(ins, ` "#<>?[\\]^\`{|}${ CTRL_CHARS }${ UNICODE_CHARS }`);
			_testSetEntity(ins);
		});

		it("should allow setting empty components when component type is query", () => {
			const ins = new URIComponent(component.TYPE_QUERY);

			_assert.doesNotThrow(() => ins.string = "");
		});

		it("should only set valid query components when component type is query", () => {
			const ins = new URIComponent(component.TYPE_QUERY);
			const valid = [[
				gen.FLAG_ENCODE,
				gen.FLAG_PRESERVE,
				gen.FLAG_DELIMITER
			]];

			_testChars(ins, generator(valid, 0.1, 1, 2));
		});

		it("should correctly encode query component when component type is query", () => {
			const ins = new URIComponent(component.TYPE_QUERY);

			_testSetDecode(ins);
			_testSetPreserve(ins, "!%21$%24&%26'%27(%28)%29*%2A+%2B,%2C/%2F:%3A;%3B=%3D?%3F@%40");
			_testSetEncode(ins, ` "#<>[\\]^\`{|}${ CTRL_CHARS }${ UNICODE_CHARS}`);
			_testSetEntity(ins);
		});

		it("should allow setting empty components when component type is fragment", () => {
			const ins = new URIComponent(component.TYPE_FRAGMENT);

			_assert.doesNotThrow(() => ins.string = "");
		});

		it("should only set valid fragment components when component type is fragment", () => {
			const ins = new URIComponent(component.TYPE_FRAGMENT);
			const valid = [[
				gen.FLAG_ENCODE,
				gen.FLAG_PRESERVE,
				gen.FLAG_DELIMITER
			]];

			_testChars(ins, generator(valid, 0.1, 1, 2));
		});

		it("should correctly encode fragment components when component type is fragment", () => {
			const ins = new URIComponent(component.TYPE_FRAGMENT);

			_testSetDecode(ins);
			_testSetPreserve(ins, "!%21$%24&%26'%27(%28)%29*%2A+%2B,%2C/%2F:%3A;%3B=%3D?%3F@%40");
			_testSetEncode(ins, ` "#<>[\\]^\`{|}${ CTRL_CHARS}${ UNICODE_CHARS }`);
			_testSetEntity(ins);
		});
	});

	describe('#stringDecoded', () => {
		it("should get the decoded component without decoded segment separators");
		it("should set the decoded component without decoded segment separators");
	});

	describe("#empty", () => {
		it("should get the empty state of the component");
		it("should not be settable");
	});

	describe('#define', () => {
		it("should reinitialize the instance");
		it("should require a valid component type as first argument");
		it("should accept a string as optional second argument");
		it("should return the instance");
	});

	describe('#copyOf', () => {
		it("should require a URIComponent as argument");
		it("should reinitialize the instance as a copy of the argument");
		it("should return the instance");
	});

	describe('#toString', () => {
		it("should return the encoded component");
	});
});
