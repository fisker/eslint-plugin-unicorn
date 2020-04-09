import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import {outdent} from 'outdent';
import rule from '../rules/prefer-await';

const ruleId = 'prefer-await';

const THEN_MESSAGE_ID = 'then';
const CATCH_MESSAGE_ID = 'catch';
const FINALLY_MESSAGE_ID = 'finally';

const ruleTester = avaRuleTester(test, {
	parserOptions: {
		ecmaVersion: 2020
	}
});

const noFixingTest = (options) => ({
	output: options.code,
	...options
})

// `then`
ruleTester.run(ruleId, rule, {
	valid: [],
	invalid: [
		{
			code: outdent`
				async function foo() {
					promise.then();
				}
			`,
			output: outdent`
				async function foo() {
					promise;
				}
			`,
			errors: [{messageId: THEN_MESSAGE_ID}]
		},
		{
			code: outdent`
				async function foo() {
					promise.then(onFulfilled);
				}
			`,
			output: outdent`
				async function foo() {
					(onFulfilled)(await promise);
				}
			`,
			errors: [{messageId: THEN_MESSAGE_ID}]
		},
		{
			code: outdent`
				async function foo() {
					promise.then(onFulfilled, onRejected);
				}
			`,
			output: outdent`
				async function foo() {
					try {(onFulfilled)(await promise)} catch (error) {(onRejected)(error)};
				}
			`,
			errors: [{messageId: THEN_MESSAGE_ID}]
		},
		// Inside a call
		{
			code: outdent`
				async function foo() {
					console.log(promise.then())
				}
			`,
			output: outdent`
				async function foo() {
					console.log(promise)
				}
			`,
			errors: [{messageId: THEN_MESSAGE_ID}]
		},
		noFixingTest({
			code: outdent`
				async function foo() {
					console.log(promise.then(onFulfilled))
				}
			`,
			errors: [{messageId: THEN_MESSAGE_ID}]
		}),
		noFixingTest({
			code: outdent`
				async function foo() {
					console.log(promise.then(onFulfilled, onRejected))
				}
			`,
			errors: [{messageId: THEN_MESSAGE_ID}]
		}),
		// Need semicolon
		{
			code: outdent`
				async function foo() {
					const array = []
					promise.then(onFulfilled)
				}
			`,
			output: outdent`
				async function foo() {
					const array = []
					;(onFulfilled)(await promise)
				}
			`,
			errors: [{messageId: THEN_MESSAGE_ID}]
		},
	]
});

// `catch`
ruleTester.run(ruleId, rule, {
	valid: [],
	invalid: [
		{
			code: outdent`
				async function foo() {
					promise.catch(onRejected);
				}
			`,
			output: outdent`
				async function foo() {
					try{ await promise; } catch(error) { onRejected(error); };
				}
			`,
			errors: [{messageId: CATCH_MESSAGE_ID}]
		},
		// Inside call
		noFixingTest({
			code: outdent`
				async function foo() {
					console.log(promise.catch(onRejected))
				}
			`,
			errors: [{messageId: CATCH_MESSAGE_ID}]
		}),
	]
});


// `finally`
ruleTester.run(ruleId, rule, {
	valid: [],
	invalid: [
		{
			code: outdent`
				async function foo() {
					promise.finally(onFinally);
				}
			`,
			output: outdent`
				async function foo() {
					try{ await promise; } finally { onFinally(); };
				}
			`,
			errors: [{messageId: FINALLY_MESSAGE_ID}]
		},
		// Inside call
		noFixingTest({
			code: outdent`
				async function foo() {
					console.log(promise.finally(onFinally))
				}
			`,
			errors: [{messageId: FINALLY_MESSAGE_ID}]
		}),
	]
});
