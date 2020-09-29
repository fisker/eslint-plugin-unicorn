import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/{{RULE_ID}}';

const ruleId = '{{RULE_ID}}';

const ruleTester = avaRuleTester(test, {
	parserOptions: {
		ecmaVersion: 2021
	}
});

ruleTester.run(ruleId, rule, {
	valid: [
		'/* A valid case */'
	],
	invalid: [
		{
			code: '/* A invalid case */',
			output: '/* A valid case with fix */',
			errors: [{messageId: ruleId}]
		}
	]
});
