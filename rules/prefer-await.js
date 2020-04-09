'use strict';
const getDocumentationUrl = require('./utils/get-documentation-url');
const methodSelector = require('./utils/method-selector');
const needsSemicolon = require('./utils/needs-semicolon');
const isValueNotUsable = require('./utils/is-value-not-usable')

const THEN_MESSAGE_ID = 'then';
const CATCH_MESSAGE_ID = 'catch';
const FINALLY_MESSAGE_ID = 'finally';

const thenSelector = methodSelector({
	name: 'then',
	max: 2
});

const catchSelector = methodSelector({
	name: 'catch',
	length: 1
});

const finallySelector = methodSelector({
	name: 'finally',
	length: 1
});

const removeCall = (fixer, node) => fixer.removeRange([node.callee.object.range[1], node.range[1]]);

function create(context) {
	const sourceCode = context.getSourceCode();

	return {
		[thenSelector](node) {
			const {arguments: parameters} = node;
			const [onFulfilled, onRejected] = parameters;

			// no argument `.then` can be removed
			if (parameters.length !== 0 && !isValueNotUsable(node)) {
				context.report({
					node: node.callee.property,
					messageId: THEN_MESSAGE_ID,
				});
				return;
			}

			if (parameters.length !== 0) {
				// TBD: check inside async function
			}

			let before = '';
			let after = '';
			let onFulfilledText = '';
			let onRejectedText = '';
			const problem = {
				node: node.callee.property,
				messageId: THEN_MESSAGE_ID
			};

			if (onFulfilled) {
				onFulfilledText = sourceCode.getText(onFulfilled);
				before = `(${onFulfilledText})(await ${before}`;
				after = `${after})`;
			}

			if (onRejected) {
				onRejectedText = sourceCode.getText(onRejected);
				before = `try {${before}`;
				after = `${after}} catch (error) {(${onRejectedText})(error)}`;
			}

			if (needsSemicolon(sourceCode.getTokenBefore(node), sourceCode, before)) {
				before = `;${before}`;
			}

			context.report({
				node: node.callee.property,
				messageId: THEN_MESSAGE_ID,
				fix: fixer => [
					// Insert `await`
					fixer.insertTextBefore(node, before),
					// Add `call()`
					fixer.insertTextAfter(node, after),
					removeCall(fixer, node)
				]
			});
		},
		[catchSelector](node) {
			const [onRejected] = node.arguments;
			const problem = {
				node: node.callee.property,
				messageId: CATCH_MESSAGE_ID,
			};
			if (!isValueNotUsable(node)) {
				context.report(problem);
				return;
			}
			// TBD: check inside async function
			problem.fix = fixer => [
				// Insert `await`
				fixer.insertTextBefore(node, 'try{ await '),
				// Add `call()`
				fixer.insertTextAfter(node, `; } catch(error) { ${sourceCode.getText(onRejected)}(error); }`),
				removeCall(fixer, node)
			];
			context.report(problem);
		},
		[finallySelector](node) {
			const [onFinally] = node.arguments;
			const problem = {
				node: node.callee.property,
				messageId: FINALLY_MESSAGE_ID,
			};
			if (!isValueNotUsable(node)) {
				context.report(problem);
				return;
			}
			// TBD: check inside async function
			problem.fix = fixer => [
				// Insert `await`
				fixer.insertTextBefore(node, 'try{ await '),
				// Add `call()`
				fixer.insertTextAfter(node, `; } finally { ${sourceCode.getText(onFinally)}(); }`),
				removeCall(fixer, node)
			];
			context.report(problem);
		}
	};
}

module.exports = {
	create,
	meta: {
		type: 'suggestion',
		docs: {
			url: getDocumentationUrl(__filename)
		},
		fixable: 'code',
		messages: {
			[THEN_MESSAGE_ID]: 'Prefer `await` over `Promise#then()`.',
			[CATCH_MESSAGE_ID]: 'Prefer `try { await … } catch { … }` over `Promise#catch()`.',
			[FINALLY_MESSAGE_ID]: 'Prefer `try { await … } finally { … }` over `Promise#finally()`.'
		}
	}
};
