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
		it("should accept a string as optional sole argument", () => {
			gen.test([
				gen.TYPE_UNDEFINED,
				gen.TYPE_STRING
			], (first) => new URINameComponent(first));
		});

		it("should create a new instance", () => {
			const ins = new URINameComponent();

			_assert(ins instanceof URINameComponent);
		});
	});

	describe('#string', () => {
		it("should get the forward notation component", () => {
			const ins = new URINameComponent("subdomain.domain.tld");

			_assert.strictEqual(ins.string, "subdomain.domain.tld");
		});

		it("should set the forward notation component", () => {
			const ins = new URINameComponent();

			_assert.strictEqual(ins.string, "");

			ins.string = "subdomain.domain.tld";

			_assert.strictEqual(ins.string, "subdomain.domain.tld");
		});

		it("should allow setting empty components", () => {
			const ins = new URINameComponent();

			_assert.doesNotThrow(() => ins.string = "");
		});

		it("should accept valid dns compatible components", () => {
			const ins = new URINameComponent();

			const args = {
				"t" : true,
				"T" : true,
				"0" : false,
				"-" : false,
				"td" : true,
				"TD" : true,
				"t0" : true,
				"t-" : false,
				"tld" : true,
				"TLD" : true,
				"tl0" : true,
				"t0d" : true,
				"tl-" : false,
				"t-d" : true,
				".tld" : false,
				"d.tld" : true,
				"D.tld" : true,
				"0.tld" : false,
				"-.tld" : false,
				"do.tld" : true,
				"DO.tld" : true,
				"0o.tld" : false,
				"d0.tld" : true,
				"-o.tld" : false,
				"d-.tld" : false,
				"dom.tld" : true,
				"DOM.tld" : true,
				"0om.tld" : false,
				"d0m.tld" : true,
				"do0.tld" : true,
				"-om.tld" : false,
				"d-m.tld" : true,
				"do-.tld" : false
			};

			for (let arg in args) {
				if (args[arg]) _assert.doesNotThrow(() => ins.string = String(arg));
				else _assert.throws(() => ins.string = String(arg), Error);
			}
		});

		it("should accept valid ip4 compatible components", () => {
			const ins = new URINameComponent();

			const args = {
				"0" : false,
				"0." : false,
				"0.0" : false,
				"0.0." : false,
				"0.0.0" : false,
				"0.0.0." : false,
				"0.0.0.0" : true,
				"0.0.0.0." : false,
				"0.0.0.0.0" : false,
				"00.0.0.0" : false,
				"1.0.0.0" : true,
				"9.0.0.0" : true,
				"09.0.0.0" : false,
				"10.0.0.0" : true,
				"19.0.0.0" : true,
				"91.0.0.0" : true,
				"99.0.0.0" : true,
				"099.0.0.0" : false,
				"100.0.0.0" : true,
				"101.0.0.0" : true,
				"110.0.0.0" : true,
				"109.0.0.0" : true,
				"190.0.0.0" : true,
				"199.0.0.0" : true,
				"200.0.0.0" : true,
				"0200.0.0.0" : false,
				"201.0.0.0" : true,
				"210.0.0.0" : true,
				"211.0.0.0" : true,
				"209.0.0.0" : true,
				"240.0.0.0" : true,
				"249.0.0.0" : true,
				"250.0.0.0" : true,
				"251.0.0.0" : true,
				"255.0.0.0" : true,
				"256.0.0.0" : false,
				"259.0.0.0" : false,
				"260.0.0.0" : false,
				"261.0.0.0" : false,
				"265.0.0.0" : false,
				"269.0.0.0" : false
			};

			for (let arg in args) {
				if (args[arg]) _assert.doesNotThrow(() => ins.string = arg);
				else _assert.throws(() => ins.string = arg, Error);
			}
		});

		it("should accept valid ip6 compatible components");

		it("should not accept other legal name components", () => {
			const ins = new URINameComponent();

			const args = {
				"some!name" : false,
				"some$name" : false,
				"some'name" : false,
				"some(name" : false,
				"some)name" : false,
				"some*name" : false,
				"some+name" : false,
				"some,name" : false,
				"some;name" : false,
				"some=name" : false,
				"some_name" : false,
				"some~name" : false,
				"some%20name" : false
			};

			for (let arg in args) {
				if (args[arg]) _assert.doesNotThrow(() => ins.string = arg);
				else _assert.throws(() => ins.string = arg, Error);
			}
		});
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
