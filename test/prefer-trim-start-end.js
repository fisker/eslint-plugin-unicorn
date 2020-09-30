import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import {outdent} from 'outdent';
import visualizeRuleTester from './utils/visualize-rule-tester';
import rule from '../rules/prefer-trim-start-end';

const valid = [
	'foo.trimStart()',
	'foo.trimEnd()',
	// Not `CallExpression`
	'new foo.trimLeft();',
	// Not `MemberExpression`
	'trimLeft();',
	// `callee.property` is not a `Identifier`
	'foo[\'trimLeft\']();',
	// Computed
	'foo[trimLeft]();',
	// Not `trimLeft`/`trimRight`
	'foo.bar();',
	// More argument(s)
	'foo.trimLeft(extra);',
	'foo.trimLeft(...argumentsArray)',
	// `trimLeft` is in argument
	'foo.bar(trimLeft)',
	'foo.bar(foo.trimLeft)',
	// `trimLeft` is in `MemberExpression.object`
	'trimLeft.foo()',
	'foo.trimLeft.bar()'
];
const invalid = [
	'foo.trimLeft()',
	'foo.trimRight()',
	'trimLeft.trimRight()',
	'foo.trimLeft.trimRight()',
	'"foo".trimLeft()',
	outdent`
		foo
			// comment
			.trimRight/* comment */(
				/* comment */
			)
	`,
];

const testOptions = {
	parserOptions: {
		ecmaVersion: 2021,
	}
};
avaRuleTester(test, testOptions).run('prefer-trim-start-end', rule, {valid, invalid: []});
visualizeRuleTester(test, testOptions).run('prefer-trim-start-end', rule, invalid);
