import _assert from 'assert';

import URINameComponent from '../source/URINameComponent';

import { describe, it } from 'mocha';
import useWith, * as use from 'tesa';



describe('URINameComponent', () => {
	describe(".ComponentString", () => {
		it("should accept a string as optional first argument", () => {
			useWith([
				use.TYPE_UNDEFINED,
				use.TYPE_STRING
			], first => URINameComponent.ComponentString(first));
		});

		it("should return an initialised instance", () => {
			const ins = URINameComponent.ComponentString("subdomain.domain.tld");

			_assert(ins instanceof URINameComponent);
			_assert.strictEqual(ins.string, "subdomain.domain.tld");
		});

		it("should accept a URINameComponent as optional second argument", () => {
			const ins = new URINameComponent();

			useWith([
				use.TYPE_UNDEFINED,
				use.TYPE_STRING
			], [
				use.TYPE_UNDEFINED,
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
			useWith([
				use.TYPE_UNDEFINED,
				use.TYPE_STRING
			], first => URINameComponent.ComponentReverseString(first));
		});

		it("should return an initialised instance", () => {
			const ins = URINameComponent.ComponentReverseString("tld.domain.subdomain");

			_assert(ins instanceof URINameComponent);
			_assert.strictEqual(ins.string, "subdomain.domain.tld");
		});

		it("should accept a URINameComponent as optional second argument", () => {
			const ins = new URINameComponent();

			useWith([
				use.TYPE_UNDEFINED,
				use.TYPE_STRING
			], [
				use.TYPE_UNDEFINED,
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
		it("should require a string as first argument", () => {
			useWith([
				use.TYPE_STRING
			], first => URINameComponent.URIString(first));
		});

		it("should return an initialised instance", () => {
			const ins = URINameComponent.URIString("//subdomain.domain.tld");

			_assert(ins instanceof URINameComponent);
			_assert(ins.string, "subdomain.domain.tld");
		});

		it("should accept an URINameComponent as optional second argument", () => {
			useWith([
				use.TYPE_STRING
			], [
				use.TYPE_UNDEFINED,
				new URINameComponent("")
			], (first, second) => URINameComponent.URIString(first, second));
		});

		it("should return the reinitialised second argument if provided", () => {
			const target = new URINameComponent("domain.tld");
			const ins = URINameComponent.URIString("//subdomain.domain.tld", target);

			_assert.strictEqual(ins, target);
			_assert.strictEqual(ins.string, "subdomain.domain.tld");
		});
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
			useWith([
				use.TYPE_UNDEFINED,
				use.TYPE_STRING
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
		it("should get the reverse notation component", () => {
			const ins = new URINameComponent("subdomain.domain.tld");

			_assert.strictEqual(ins.stringReverse, "tld.domain.subdomain");
		});

		it("should set the reverse notation component", () => {
			const ins = new URINameComponent();

			_assert.strictEqual(ins.string, "");
			_assert.strictEqual(ins.stringReverse, "");

			ins.stringReverse = "tld.domain.subdomain";

			_assert.strictEqual(ins.string, "subdomain.domain.tld");
			_assert.strictEqual(ins.stringReverse, "tld.domain.subdomain");
		});

		it("should allow setting empty components", () => {
			const ins = new URINameComponent("subdomain.domain.tld");

			_assert.strictEqual(ins.string, "subdomain.domain.tld");
			_assert.strictEqual(ins.stringReverse, "tld.domain.subdomain");
			_assert.doesNotThrow(() => ins.stringReverse = "");
			_assert.strictEqual(ins.stringReverse, "");
			_assert.strictEqual(ins.string, "");
		});

		it("should accept valid dns conforming components", () => {
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
				if (args[arg]) _assert.doesNotThrow(() => ins.stringReverse = String(arg));
				else _assert.throws(() => ins.stringReverse = String(arg), Error);
			}
		});

		it("should not accept valid ip4 conforming components", () => {
			const ins = new URINameComponent();

			const args = {
				"0" : false,
				"0." : false,
				"0.0" : false,
				"0.0." : false,
				"0.0.0" : false,
				"0.0.0." : false,
				"0.0.0.0" : false,
				"0.0.0.0." : false,
				"0.0.0.0.0" : false,
				"00.0.0.0" : false,
				"1.0.0.0" : false,
				"9.0.0.0" : false,
				"09.0.0.0" : false,
				"10.0.0.0" : false,
				"19.0.0.0" : false,
				"91.0.0.0" : false,
				"99.0.0.0" : false,
				"099.0.0.0" : false,
				"100.0.0.0" : false,
				"101.0.0.0" : false,
				"110.0.0.0" : false,
				"109.0.0.0" : false,
				"190.0.0.0" : false,
				"199.0.0.0" : false,
				"200.0.0.0" : false,
				"0200.0.0.0" : false,
				"201.0.0.0" : false,
				"210.0.0.0" : false,
				"211.0.0.0" : false,
				"209.0.0.0" : false,
				"240.0.0.0" : false,
				"249.0.0.0" : false,
				"250.0.0.0" : false,
				"251.0.0.0" : false,
				"255.0.0.0" : false,
				"256.0.0.0" : false,
				"259.0.0.0" : false,
				"260.0.0.0" : false,
				"261.0.0.0" : false,
				"265.0.0.0" : false,
				"269.0.0.0" : false
			};

			for (let arg in args) {
				if (args[arg]) _assert.doesNotThrow(() => ins.stringReverse = arg);
				else _assert.throws(() => ins.stringReverse = arg, Error);
			}
		});

		it("should not accept valid ip6 conforming components");

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
				if (args[arg]) _assert.doesNotThrow(() => ins.stringReverse = arg);
				else _assert.throws(() => ins.stringReverse = arg, Error);
			}
		});
	});

	describe('#segments', () => {
		it("should get a reverse notation array of component segments for dns conforming components", () => {
			const ins = new URINameComponent("subdomain.domain.tld");

			_assert.deepStrictEqual(ins.segments, ["tld", "domain", "subdomain"]);
		});

		it("should get an empty array for ip4 conforming components", () => {
			const ins = new URINameComponent("0.0.0.0");

			_assert.deepStrictEqual(ins.segments, []);
		});

		it("should get an empty array for ip6 conforming components");

		it("should set a reverse notation array of component segments", () => {
			const ins = new URINameComponent();

			_assert.strictEqual(ins.string, "");
			_assert.strictEqual(ins.stringReverse, "");

			ins.segments = [ "tld", "domain", "subdomain" ];

			_assert.strictEqual(ins.string, "subdomain.domain.tld");
			_assert.strictEqual(ins.stringReverse, "tld.domain.subdomain");
		});

		it("should allow setting empty arrays", () => {
			const ins = new URINameComponent("subdomain.domain.tld");

			_assert.strictEqual(ins.string, "subdomain.domain.tld");
			_assert.strictEqual(ins.stringReverse, "tld.domain.subdomain");
			_assert.doesNotThrow(() => ins.segments = []);
			_assert.strictEqual(ins.string, "");
			_assert.strictEqual(ins.stringReverse, "");
		});

		it("should accept valid dns comforming component segments", () => {
			const ins = new URINameComponent();

			const args = [
				{ item : [ "" ], valid : false },
				{ item : [ "t" ], valid : true },
				{ item : [ "T" ], valid : true },
				{ item : [ "0" ], valid : false },
				{ item : [ "-" ], valid : false },
				{ item : [ "td" ], valid : true },
				{ item : [ "TD" ], valid : true },
				{ item : ["t0" ], valid : true },
				{ item : [ "t-" ], valid : false },
				{ item : [ "tld" ], valid : true },
				{ item : [ "TLD" ], valid : true },
				{ item : [ "tl0" ], valid : true },
				{ item : [ "t0d" ], valid : true },
				{ item : [ "tl-" ], valid : false },
				{ item : [ "t-d" ], valid : true },
				{ item : [ "", "tld" ], valid : false },
				{ item : [ "d", "tld" ], valid : true },
				{ item : [ "D", "tld" ], valid : true },
				{ item : [ "0", "tld" ], valid : false },
				{ item : [ "-", "tld" ], valid : false },
				{ item : [ "do", "tld" ], valid : true },
				{ item : [ "DO", "tld" ], valid : true },
				{ item : [ "0o", "tld" ], valid : false },
				{ item : [ "d0","tld" ], valid : true },
				{ item : [ "-o", "tld" ], valid : false },
				{ item : [ "d-", "tld" ], valid : false },
				{ item : [ "dom", "tld" ], valid : true },
				{ item : [ "DOM", "tld" ], valid : true },
				{ item : [ "0om", "tld" ], valid : false },
				{ item : [ "d0m", "tld" ], valid : true },
				{ item : [ "do0", "tld" ], valid : true },
				{ item : [ "-om", "tld" ], valid : false },
				{ item : [ "d-m", "tld" ], valid : true },
				{ item : ["do-", "tld" ], valid : false }
			];

			for (let arg of args) {
				if (arg.valid) _assert.doesNotThrow(() => ins.segments = arg.item);
				else _assert.throws(() => ins.segments = arg.item, Error);
			}
		});

		it("should not accept valid ip4 conforming component segments", () => {
			const ins = new URINameComponent();

			const args = [
				{ item : "0.0.0.0", valid : false },
				{ item : "255.255.255.255", valid : false }
			];

			for (let arg of args) {
				if (arg.valid) _assert.doesNotThrow(() => ins.segments = arg.item);
				else _assert.throws(() => ins.segments = arg.item, Error);
			}
		});

		it("should not accept valid ip6 conforming component segments");

		it("should not accept other valid name component segments", () => {
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
				if (args[arg]) _assert.doesNotThrow(() => ins.segments = [ arg ]);
				else _assert.throws(() => ins.segments = [ arg ], Error);
			}
		});
	});

	describe("#isIP4", () => {
		it("should be true if the component is a valid ip4 address", () => {
			const ins = new URINameComponent();

			const args = {
				"" : false,
				"0.0.0.0" : true,
				"domain.subdomain.tld" : false
			};

			for (let arg in args) {
				ins.string = arg;

				_assert.strictEqual(ins.isIP4, args[arg]);
			}
		});

		it("should not be settable", () => {
			const ins = new URINameComponent();

			_assert.throws(() => ins.isIP4 = true, Error);
		});
	});

	describe("#isIP6", () => {
		it("should be true if the component is a valid ip6 address");
		it("should not be settable");
	});

	describe("#isDNS", () => {
		it("should be true if the component is a valid dns name", () => {
			const ins = new URINameComponent("0.0.0.0");

			const args = {
				"" : false,
				"0.0.0.0" : false,
				"subdomain.domain.tld" : true
			};

			for (let arg in args) {
				ins.string = arg;

				_assert.strictEqual(ins.isDNS, args[arg]);
			}
		});

		it("should not be settable", () => {
			const ins = new URINameComponent();

			_assert.throws(() => ins.isDNS = true, Error);
		});
	});

	describe('#define', () => {
		it("should accept a string as optional sole argument", () => {
			const ins = new URINameComponent();

			useWith([
				use.TYPE_UNDEFINED,
				use.TYPE_STRING
			], (first) => ins.define(first));
		});

		it("should reinitialize the instance", () => {
			const ins = new URINameComponent("subdomain.domain.tld");

			_assert.strictEqual(ins.string, "subdomain.domain.tld");

			ins.define("baz.bar.foo");

			_assert.strictEqual(ins.string, "baz.bar.foo");
		});

		it("should return the instance", () => {
			const ins = new URINameComponent();

			_assert.strictEqual(ins, ins.define("subdomain.domain.tld"));
		});
	});

	describe('#toString', () => {
		it("should accept a boolean as optional first argument", () => {
			const ins = new URINameComponent("subdomain.domain.tld");

			useWith([
				use.TYPE_UNDEFINED,
				use.TYPE_BOOLEAN
			], (first) => ins.toString(first));
		});

		it("should return the same as #string if first argument is not true", () => {
			const ins = new URINameComponent("subdomain.domain.tld");

			_assert.strictEqual(ins.string, ins.toString());
			_assert.strictEqual(ins.string, ins.toString(false));
		});

		it("should return the same as #stringReverse if first argument is true", () => {
			const ins = new URINameComponent("subdomain.domain.tld");

			_assert.strictEqual(ins.stringReverse, ins.toString(true));
		});
	});
});
