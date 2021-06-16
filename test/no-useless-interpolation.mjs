/* eslint-disable no-template-curly-in-string, unicorn/escape-case */
import outdent from 'outdent';
import {getTester} from './utils/test.mjs';

const {test} = getTester(import.meta);

// Only expression
test.snapshot({
	valid: [
		'`${foo} `',
		'` ${foo}`',
	],
	invalid: [
		'`${foo}`',
		'`${"a" + 1}`',
		'`${"a" + foo}`',
		'`${String(foo)}`',
		'const foo = ""; const bar = `${foo}`',
		'const foo = ""; const bar = `${0, foo}`',
		'const foo = ""; const bar = `${(0, foo)}`',
		'const foo = ""; const bar = (`${(0, foo)}`)',
		'const foo = 1; const bar = `${foo}`',
		'const foo = 1; const bar = `${0, foo}`',
		'const foo = 1; const bar = `${(0, foo)}`',
		'const foo = 1; const bar = (`${(0, foo)}`)',
	]
});

// String as expression
test.snapshot({
	valid: [
	],
	invalid: [
		'`${ \'abc\' }`',
		'`${ "abc" }`',
		'`${    (( "abc" ))    }`',
		'`${(( "abc" ))     }`',
		'`${    (( "abc" ))}`',
		'`${ "\\"\\uFFeF\\"" }`',
		'`${ "\\\\\\"\\uFFeF\\\\\\"" }`',
		'`${ "\\\\\\\\\\"\\uFFeF\\\\\\\\\\"" }`',
		// eslint-disable-next-line quotes
		"`${ '\\'\\uFFeF\\'' }`",
		// eslint-disable-next-line quotes
		"`${ '\\\\\\'\\uFFeF\\\\\\'' }`",
		// eslint-disable-next-line quotes
		"`${ '\\\\\\\\\\'\\uFFeF\\\\\\\\\\'' }`",
		'`${ "${\\"``}" }`',
	]
});
