import {outdent} from 'outdent';
import {test} from './utils/test.js';

test.snapshot({
	valid: [
		'const foo = bar => bar',
		'const foo = function bar(baz) {return bar.name}',
		'const foo = ({bar}) => bar',
		'const foo = bar => bar[2]',
		'const foo = bar => bar[1.5]',
		'const foo = bar => bar[-1]',
		'const foo = bar => bar[0xFF]',
		'const foo = bar => bar[null]',
		'const foo = bar => bar[1n]',
		'const foo = bar => bar["baz"]',
		'const foo = bar => bar.length && bar[0]',
		'const foo = bar => bar.default',
		'const foo = bar => bar.function',
		'const foo = bar => bar.baz()',
		'const foo = bar => bar[0]()',
		'const foo = bar => new bar.Baz()',
		'const foo = bar => new bar[0]()',
		'const foo = bar => bar.baz = 1',
		'const foo = bar => bar[0] = 1',
		'const foo = bar => bar.baz += 1',
		'const foo = bar => bar.baz *= 1',
		'const foo = bar => bar.baz **= 1',
		'const foo = bar => bar.baz ||= true',
		'const foo = bar => ++bar.baz',
		'const foo = bar => bar.baz++',
		'const foo = bar => bar[0]++'
	],
	invalid: [
		'const foo = bar => bar[0]',
		'const foo = (bar) => bar[0]',
		'const foo = bar => bar[(1)]',
		'const foo = bar => bar[0] === firstElementOfBar',
		'const foo = (bar, baz) => bar[0] === baz.firstElementOfBar',
		'const foo = (bar, {baz}) => bar[0] === baz',
		'const foo = bar => bar[0b01]',
		'const foo = bar => bar.length',
		'const foo = bar => bar.baz',
		'const foo = bar => x = bar.baz',
		'const foo = bar => bar.baz.x = 1',
		'const foo = bar => x = bar[0]',
		'const foo = bar => x(bar.baz)',
		'const foo = bar => x(bar[0])',
		'const foo = bar => new X(bar.baz)',
		'const foo = bar => new X(bar[0])',
		'const foo = bar => x += bar.baz',
		outdent`
			class X {
				foo(bar) {
					this.baz = bar.baz;
				}
			}
		`
	]
});
