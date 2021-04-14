import outdent from 'outdent';
import {getTester} from './utils/test.mjs';

const {test} = getTester(import.meta);

// `Object.keys`
test.snapshot({
	valid: [
	],
	invalid: [
		outdent`
			for (const key of Object.keys(foo)) {
				bar(foo[key]);
			}
		`,
		outdent`
			for (const key of Object.keys(foo)) {
				bar(foo[key], key);
			}
		`,
		'const foo = Object.keys(bar).map(key => baz(bar[key]));',
		'const foo = Object.keys(bar).map(key => baz(bar[key], key));',
	]
});
