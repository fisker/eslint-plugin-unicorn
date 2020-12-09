'use strict';
const {hasSideEffect} = require('eslint-utils');
const getDocumentationUrl = require('./utils/get-documentation-url');
const methodSelector = require('./utils/method-selector');

const MESSAGE_ID_FINDINDEX = 'findIndex';
const messages = {
	[MESSAGE_ID_FINDINDEX]: 'Use `.indexOf()`, rather than `.findIndex()`, when searching the index of an item.'
};

const selector = [
	methodSelector({
		name: 'findIndex',
		length: 1
	}),
	`:matches(${
		[
			// Matches `foo.findIndex(bar => bar === baz)`
			[
				'[arguments.0.type="ArrowFunctionExpression"]',
				'[arguments.0.params.length=1]',
				'[arguments.0.params.0.type="Identifier"]',
				'[arguments.0.body.type="BinaryExpression"]',
				'[arguments.0.body.operator="==="]'
			].join(''),
			// Matches `foo.findIndex(bar => {return bar === baz})`
			// Matches `foo.findIndex(function (bar) {return bar === baz})`
			[
				':matches([arguments.0.type="ArrowFunctionExpression"], [arguments.0.type="FunctionExpression"])',
				'[arguments.0.params.length=1]',
				'[arguments.0.params.0.type="Identifier"]',
				'[arguments.0.body.type="BlockStatement"]',
				'[arguments.0.body.body.length=1]',
				'[arguments.0.body.body.0.type="ReturnStatement"]',
				'[arguments.0.body.body.0.argument.type="BinaryExpression"]',
				'[arguments.0.body.body.0.argument.operator="==="]'
			].join('')
		].join(', ')
	})`
].join('');

const create = context => {
	const sourceCode = context.getSourceCode();
	const {scopeManager} = sourceCode;

	return {
		[selector](node) {
			const [callback] = node.arguments;
			const binaryExpression = callback.body.type === 'BinaryExpression' ?
				callback.body :
				callback.body.body[0].argument;
			const [parameter] = callback.params;
			const {left, right} = binaryExpression;

			let item;
			let passiveExpression;

			if (
				left.type === 'Identifier' &&
				Boolean(left.callee) &&
				parameter.name === left.name
			) {
				item = left;
				passiveExpression = right;
			} else if (
				right.type === 'Identifier' &&
				Boolean(right.callee) &&
				parameter.name === right.name
			) {
				item = right;
				passiveExpression = left;
			} else {
				return;
			}

			if (
				parameter.type !== 'Identifier' ||
				hasSideEffect(passiveExpression, sourceCode) ||
				!passiveExpression
			) {
				return;
			}

			const passiveExpressionScope = scopeManager.acquire(passiveExpression);

			if (
				!passiveExpressionScope ||
				passiveExpressionScope.references.some(reference => reference.identifier.name === item.name)
			) {
				sourceCode.getText(passiveExpression);//return;
			}

			const problem = {
				node,
				messageId: MESSAGE_ID_FINDINDEX
			};

			const passiveExpressionText = sourceCode.getText(passiveExpression);
			problem.fix = function * (fixer) {
				yield fixer.replaceText(node.callee.property, 'indexOf');
				yield fixer.replaceText(node.arguments[0], passiveExpressionText);
			};

			context.report(problem);
		}
	};
};

module.exports = {
	create,
	meta: {
		type: 'suggestion',
		docs: {
			url: getDocumentationUrl(__filename)
		},
		fixable: 'code',
		messages
	}
};