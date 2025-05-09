import outdent from 'outdent';
import {getTester} from './utils/test.js';

const {test} = getTester(import.meta);

const MESSAGE_ID_SUBSTR = 'substr';
const MESSAGE_ID_SUBSTRING = 'substring';

const errorsSubstr = [
	{
		messageId: MESSAGE_ID_SUBSTR,
	},
];
const errorsSubstring = [
	{
		messageId: MESSAGE_ID_SUBSTRING,
	},
];

test({
	valid: [
		'const substr = foo.substr',
		'const substring = foo.substring',

		'foo.slice()',
		'foo.slice(0)',
		'foo.slice(1, 2)',
		'foo?.slice(1, 2)',
		'foo?.slice?.(1, 2)',
		'foo?.bar.baz.slice(1, 2)',
		'foo.slice(-3, -2)',
	],

	invalid: [
		{
			code: 'foo.substr()',
			output: 'foo.slice()',
			errors: errorsSubstr,
		},
		{
			code: 'foo?.substr()',
			output: 'foo?.slice()',
			errors: errorsSubstr,
		},
		{
			code: 'foo.bar?.substring()',
			output: 'foo.bar?.slice()',
			errors: errorsSubstring,
		},
		{
			code: 'foo?.[0]?.substring()',
			output: 'foo?.[0]?.slice()',
			errors: errorsSubstring,
		},
		{
			code: 'foo.bar.substr?.()',
			output: 'foo.bar.slice?.()',
			errors: errorsSubstr,
		},
		{
			code: 'foo.bar?.substring?.()',
			output: 'foo.bar?.slice?.()',
			errors: errorsSubstring,
		},
		{
			code: 'foo.bar?.baz?.substr()',
			output: 'foo.bar?.baz?.slice()',
			errors: errorsSubstr,
		},
		{
			code: 'foo.bar?.baz.substring()',
			output: 'foo.bar?.baz.slice()',
			errors: errorsSubstring,
		},
		{
			code: 'foo.bar.baz?.substr()',
			output: 'foo.bar.baz?.slice()',
			errors: errorsSubstr,
		},
		{
			code: '"foo".substr()',
			output: '"foo".slice()',
			errors: errorsSubstr,
		},
		{
			code: '"foo".substr(bar.length, Math.min(baz, 100))',
			errors: errorsSubstr,
		},
		{
			code: '"foo".substr(1, "abc".length)',
			errors: errorsSubstr,
		},
		{
			code: '"foo".substr("1", 2)',
			errors: errorsSubstr,
		},
		{
			code: outdent`
				const length = 123;
				"foo".substr(1, length)
			`,
			errors: errorsSubstr,
		},
		{
			code: outdent`
				const length = 123;
				"foo".substr(0, length)
			`,
			output: outdent`
				const length = 123;
				"foo".slice(0, Math.max(0, length))
			`,
			errors: errorsSubstr,
		},
		{
			code: outdent`
				const length = 123;
				"foo".substr('0', length)
			`,
			errors: errorsSubstr,
		},
		{
			code: '"foo".substr(0, -1)',
			output: '"foo".slice(0, 0)',
			errors: errorsSubstr,
		},
		{
			code: '"foo".substr(0, "foo".length)',
			output: '"foo".slice(0, "foo".length)',
			errors: errorsSubstr,
		},
		{
			code: outdent`
				const length = 123;
				"foo".substr(1, length - 4)
			`,
			errors: errorsSubstr,
		},
		{
			code: '"foo".substr(1, length)',
			errors: errorsSubstr,
		},
		{
			code: outdent`
				const uri = 'foo';
				((uri || '')).substr(1)
			`,
			output: outdent`
				const uri = 'foo';
				((uri || '')).slice(1)
			`,
			errors: errorsSubstr,
		},

		{
			code: 'foo.substr(start)',
			output: 'foo.slice(start)',
			errors: errorsSubstr,
		},
		{
			code: '"foo".substr(1)',
			output: '"foo".slice(1)',
			errors: errorsSubstr,
		},
		{
			code: 'foo.substr(start, length)',
			errors: errorsSubstr,
		},
		{
			code: '"foo".substr(1, 2)',
			output: '"foo".slice(1, 3)',
			errors: errorsSubstr,
		},
		// Extra arguments
		{
			code: 'foo.substr(1, 2, 3)',
			errors: errorsSubstr,
		},
		// #700
		{
			code: '"Sample".substr(0, "Sample".lastIndexOf("/"))',
			output: '"Sample".slice(0, Math.max(0, "Sample".lastIndexOf("/")))',
			errors: errorsSubstr,
		},

		{
			code: 'foo.substring()',
			output: 'foo.slice()',
			errors: errorsSubstring,
		},
		{
			code: '"foo".substring()',
			output: '"foo".slice()',
			errors: errorsSubstring,
		},
		{
			code: '"foo".substring(1)',
			output: '"foo".slice(1)',
			errors: errorsSubstring,
		},
		{
			code: '"foo".substring(1, 2)',
			output: '"foo".slice(1, 2)',
			errors: errorsSubstring,
		},
		{
			code: '"foo".substring(2, 1)',
			output: '"foo".slice(1, 2)',
			errors: errorsSubstring,
		},
		{
			code: '"foo".substring(-1, -5)',
			output: '"foo".slice(0, 0)',
			errors: errorsSubstring,
		},
		{
			code: '"foo".substring(-1, 2)',
			output: '"foo".slice(0, 2)',
			errors: errorsSubstring,
		},
		{
			code: '"foo".substring(length)',
			output: '"foo".slice(Math.max(0, length))',
			errors: errorsSubstring,
		},
		{
			code: '"foo".substring("fo".length)',
			output: '"foo".slice("fo".length)',
			errors: errorsSubstring,
		},
		{
			code: '"foo".substring(0, length)',
			output: '"foo".slice(0, Math.max(0, length))',
			errors: errorsSubstring,
		},
		{
			code: '"foo".substring(length, 0)',
			output: '"foo".slice(0, Math.max(0, length))',
			errors: errorsSubstring,
		},

		{
			code: 'foo.substring(start)',
			output: 'foo.slice(Math.max(0, start))',
			errors: errorsSubstring,
		},
		{
			code: 'foo.substring(start, end)',
			errors: errorsSubstring,
		},
		{
			code: '"foo".substring(1, 3)',
			output: '"foo".slice(1, 3)',
			errors: errorsSubstring,
		},
		// Extra arguments
		{
			code: 'foo.substring(1, 2, 3)',
			errors: errorsSubstring,
		},
	],
});

test.typescript({
	valid: [],
	invalid: [
		{
			code: outdent`
				function foo() {
					return (bar as string).substr(3);
				}
			`,
			output: outdent`
				function foo() {
					return (bar as string).slice(3);
				}
			`,
			errors: errorsSubstr,
		},
		{
			code: outdent`
				function foo() {
					return ((bar as string)).substring(3);
				}
			`,
			output: outdent`
				function foo() {
					return ((bar as string)).slice(3);
				}
			`,
			errors: errorsSubstring,
		},
	],
});

test.snapshot({
	valid: [],
	invalid: [
		outdent`
			/* 1 */ (( /* 2 */ 0 /* 3 */, /* 4 */ foo /* 5 */ )) /* 6 */
				. /* 7 */ substring /* 8 */ (
					/* 9 */ (( /* 10 */ bar /* 11 */ )) /* 12 */,
					/* 13 */ (( /* 14 */ 0 /* 15 */ )) /* 16 */,
					/* 17 */
				)
			/* 18 */
		`,
		'foo.substr(0, ...bar)',
		'foo.substr(...bar)',
		'foo.substr(0, (100, 1))',
		'foo.substr(0, 1, extraArgument)',
		'foo.substr((0, bar.length), (0, baz.length))',
		// TODO: Fix this
		// 'foo.substr(await 1, await 2)',
		'foo.substring((10, 1), 0)',
		'foo.substring(0, (10, 1))',
		'foo.substring(0, await 1)',
		'foo.substring((10, bar))',
		outdent`
			const string = "::";
			const output = string.substr(-2, 2);
		`,
	],
});
