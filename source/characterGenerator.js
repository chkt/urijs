export const FLAG_ENCODE = 0x00100;
export const FLAG_PRESERVE = 0x00200;
export const FLAG_CONTROL = 0x00400;
export const FLAG_GLYPH = 0x00800;
export const FLAG_DIGIT = 0x01000;
export const FLAG_ALPHA = 0x02000;
export const FLAG_UPPERCASE = 0x04000;
export const FLAG_LOWERCASE = 0x08000;
export const FLAG_DELIMITER = 0x10000;
export const FLAG_TOPLEVEL = 0x20000;
export const FLAG_SUBLEVEL = 0x40000;
export const FLAG_ESCAPE = 0x80000;

export const CTRL = FLAG_ENCODE | FLAG_CONTROL;
export const CODE = FLAG_ENCODE | FLAG_GLYPH;
export const DIG  = FLAG_PRESERVE | FLAG_GLYPH | FLAG_DIGIT;
export const A_UP = FLAG_PRESERVE | FLAG_GLYPH | FLAG_ALPHA | FLAG_UPPERCASE;
export const A_LO = FLAG_PRESERVE | FLAG_GLYPH | FLAG_ALPHA | FLAG_LOWERCASE;
export const OTHR = FLAG_PRESERVE | FLAG_GLYPH;
export const TOP  = FLAG_GLYPH | FLAG_DELIMITER | FLAG_TOPLEVEL;
export const SUB  = FLAG_GLYPH | FLAG_DELIMITER | FLAG_SUBLEVEL;
export const ESC  = FLAG_GLYPH | FLAG_ESCAPE;

export const SPC  = 0x20 | CODE, EXCL = 0x21 | SUB , QUOT = 0x22 | CODE, HASH = 0x23 | TOP ;
export const USD  = 0x24 | SUB , PCT  = 0x25 | ESC , AMP  = 0x26 | SUB , APOS = 0x27 | SUB ;
export const LPAR = 0x28 | SUB , RPAR = 0x29 | SUB , MUL  = 0x2A | SUB , PLUS = 0x2B | SUB ;
export const COMA = 0x2C | SUB , HYPH = 0x2D | OTHR, DOT  = 0x2E | OTHR, SLSH = 0x2F | TOP ;
export const COLL = 0x3A | TOP , SEMI = 0x3B | SUB , LANG = 0x3C | CODE, EQUL = 0x3D | SUB ;
export const RANG = 0x3E | CODE, QEST = 0x3F | TOP , AT   = 0x40 | TOP , LBRA = 0x5B | TOP ;
export const BSLH = 0x5C | CODE, RBRA = 0x5D | TOP , HAT  = 0x5E | CODE, UNDR = 0x5F | OTHR;
export const BTCK = 0x60 | CODE, LCRL = 0x7B | CODE, PIPE = 0x7C | CODE, RCRL = 0x7D | CODE;
export const TILD = 0x7E | OTHR;



const matrix = [
	CTRL, CTRL, CTRL, CTRL, CTRL, CTRL, CTRL, CTRL, CTRL, CTRL, CTRL, CTRL, CTRL, CTRL, CTRL, CTRL,
	CTRL, CTRL, CTRL, CTRL, CTRL, CTRL, CTRL, CTRL, CTRL, CTRL, CTRL, CTRL, CTRL, CTRL, CTRL, CTRL,
	SPC , EXCL, QUOT, HASH, USD , PCT , AMP , APOS, LPAR, RPAR, MUL , PLUS, COMA, HYPH, DOT , SLSH,
	DIG , DIG , DIG , DIG , DIG , DIG , DIG , DIG , DIG , DIG , COLL, SEMI, LANG, EQUL, RANG, QEST,
	AT    , A_UP, A_UP, A_UP, A_UP, A_UP, A_UP, A_UP, A_UP, A_UP, A_UP, A_UP, A_UP, A_UP, A_UP, A_UP,
	A_UP, A_UP, A_UP, A_UP, A_UP, A_UP, A_UP, A_UP, A_UP, A_UP, A_UP, LBRA, BSLH, RBRA, HAT , UNDR,
	BTCK, A_LO, A_LO, A_LO, A_LO, A_LO, A_LO, A_LO, A_LO, A_LO, A_LO, A_LO, A_LO, A_LO, A_LO, A_LO,
	A_LO, A_LO, A_LO, A_LO, A_LO, A_LO, A_LO, A_LO, A_LO, A_LO, A_LO, LCRL, PIPE, RCRL, TILD, CTRL
];


function _getLimits(min, max) {
	let res = [], limit = 0;

	for (let i = max; i >= min; i -= 1) {
		limit += Math.pow(128, i);
		res.push(limit);
	}

	res.reverse();

	return res;
}


export default function* (charset, fraction = 1, min = 1, max = 0) {
	const skip = 1 / Math.min(Math.max(fraction, 0.0), 1.0);
	const cl = charset.length;

	if (max === 0) max = cl;

	const limits = _getLimits(min, max);

	for (let i = 0, il = limits[0]; i < il; i += skip) {
		let string = '', valid = true;

		for (let j = 0, jl = max; j < jl; j += 1) {
			if (limits[j] < i) continue;

			const code = Math.floor(i / Math.pow(128, j)) % 128;
			const mask = matrix[code];

			const filters = j < cl ? charset[j] : charset[cl - 1];
			let charValid = false;

			for (let filter of filters) {
				const lo = filter & 0x000ff, hi = filter & 0xfff00;

				if (lo !== 0) charValid |= lo === (mask & 0x000ff);
				else charValid |= (mask & hi) === hi;
			}

			string += String.fromCharCode(code);
			valid &= charValid;
		}

		yield {
			string,
			valid
		};
	}

	return;
}
