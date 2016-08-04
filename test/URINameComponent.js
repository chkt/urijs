import _assert from 'assert';

import URINameComponent from '../source/URINameComponent';

import * as gen from '../source/argumentGenerator';



describe('URINameComponent', () => {
	describe(".ComponentString", () => {
		it("should accept a string as optional first argument", () => {
			gen.test([
				gen.TYPE_UNDEFINED,
				gen.TYPE_STRING
			], first => URINameComponent.ComponentString(first));
		});

		it("should return an initialised instance", () => {
			const ins = URINameComponent.ComponentString("subdomain.domain.tld");

			_assert(ins instanceof URINameComponent);
			_assert.strictEqual(ins.string, "subdomain.domain.tld");
		});

		it("should accept a URINameComponent as optional second argument", () => {
			const ins = new URINameComponent();

			gen.test([
				gen.TYPE_UNDEFINED,
				gen.TYPE_STRING
			], [
				gen.TYPE_UNDEFINED,
				ins
			], (first, second) => URINameComponent.ComponentString(first, second));
		});

		it("should return the reinitialised second argument if provided", () => {
			const ins = new URINameComponent();
			const res = URINameComponent.ComponentString("subdomain.domain.tld", ins);

			_assert.strictEqual(res, ins);
		});
	});

	describe(".ComponentReverseString", () => {
		it("should accept a string as optional first argument", () => {
			gen.test([
				gen.TYPE_UNDEFINED,
				gen.TYPE_STRING
			], first => URINameComponent.ComponentReverseString(first));
		});

		it("should return an initialised instance", () => {
			const ins = URINameComponent.ComponentReverseString("tld.domain.subdomain");

			_assert(ins instanceof URINameComponent);
			_assert.strictEqual(ins.string, "subdomain.domain.tld");
		});

		it("should accept a URINameComponent as optional second argument", () => {
			const ins = new URINameComponent();

			gen.test([
				gen.TYPE_UNDEFINED,
				gen.TYPE_STRING
			], [
				gen.TYPE_UNDEFINED,
				ins
			], (first, second) => URINameComponent.ComponentReverseString(first, second));
		});

		it("should return the reinitialised second argument if provided", () => {
			const ins = new URINameComponent();
			const res = URINameComponent.ComponentReverseString("tld.domain.subdomain", ins);

			_assert.strictEqual(res, ins);
		});
	});

	describe(".URIString", () => {
		it("should require a string as first argument");
		it("should return an initialised instance");
		it("should assign the extracted component as forward notated component");
		it("should accept an URINameComponent as optional second argument");
		it("should return the reinitialised second argument if provided");
	});

	describe(".Segments", () => {
		it("should require an array of nonempty strings as first argument");
		it("should return an initialized instance");
		it("should assign the the content of the first argument as reverse notated segments")
		it("should accept an URINameComponent as optional second argument");
		it("should return the reinitialised second argument if provided");
	});

	describe('#constructor', () => {
		it("should accept a string as optional sole argument");
		it("should create a new instance");
	});

	describe('#stringReverse', () => {
		it("should get the reverse notation component");
		it("should set the reverse notation component");
		it("should allow setting empty components");
		it("should not allow setting empty component segments");
		it("should only set valid components");
		it("should correctly encode components");
	});

	describe('#segments', () => {
		it("should get a reverse notation array of component segments");
		it("should set a reverse notation array of component segments");
		it("should allow setting empty arrays");
		it("should not allow setting empty component segments");
		it("should only allow setting component segment strings");
		it("should only set valid components");
		it("should correctly encode components");
	});

	describe("#isIP4", () => {
		it("should be true if the component is a valid ip4 address");
		it("should not be settable");
	});

	describe("#isIP6", () => {
		it("should be true if the component is a valid ip6 address");
		it("should not be settable");
	});

	describe("#isDNS", () => {
		it("should be true if the component is a valid dns name");
		it("should not be settable");
	});

	describe('#define', () => {
		it("should accept a string as optional sole argument");
		it("should reinitialize the instance");
		it("should return the instance");
	});

	describe('#toString', () => {
		it("should accept a bitfield as optional first argument");
		it("should return the same as #string if the NAME_REVERSE flag is not set");
		it("should return the same as #stringReverse if the NAME_REVERSE flag is set");
	});
});
