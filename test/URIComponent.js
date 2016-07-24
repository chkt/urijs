import _assert from 'assert';

import URIComponent from '../source/URIComponent';
import * as component from '../source/URIComponent';



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
		it("should get the encoded component");
		it("should set the encoded component");
		it("should only set valid scheme components when component type is scheme");
		it("should correctly encode scheme components when component type is scheme");
		it("should only set valid user components when component type is user");
		it("should correctly encode user components when component type is user");
		it("should only set valid name components when component type is name");
		it("should correctly encode name components when component type is name");
		it("should only set valid port components when component type is port");
		it("should correctly encode port components when component type is port");
		it("should only set valid path components when component type is path");
		it("should correctly encode path components when component type is path");
		it("should only set valid query components when component type is query");
		it("should correctly encode query component when component type is query");
		it("should only set valid fragment components when component type is fragment");
		it("should correctly encode fragment components when component type is fragment");
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
