import outdent from 'outdent';
import {getTester} from './utils/test.mjs';

const {test} = getTester(import.meta);

test.snapshot({
	valid: [
		'const x = 0;',
		';; const x = 0;',
		'{{{;;const x = 0;}}}',
		outdent`
			'use strict';
			const x = 0;
		`,
		';;\'use strict\';',
		'{\'use strict\';}',
		'("use strict")',
		'`use strict`',
		'({})',
		outdent`
			#!/usr/bin/env node
			console.log('done');
		`,
		'false',
		'("")',
		'NaN',
		'undefined',
		'null',
		'[]',
		'(() => {})()',
	],
	invalid: [
		'',
		' ',
		'\t',
		'\n',
		'\r',
		'\r\n',
		outdent`


		`,
		'// comment',
		'/* comment */',
		'#!/usr/bin/env node',
		'\'use asm\';',
		'\'use strict\';',
		'"use strict"',
		'""',
		';',
		';;',
		'{}',
		'{;;}',
		'{{}}',
	],
});
