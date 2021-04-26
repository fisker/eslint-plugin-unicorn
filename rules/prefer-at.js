'use strict';
const {getStaticValue} = require('eslint-utils');
const getDocumentationUrl = require('./utils/get-documentation-url');
const isSameReference = require('./utils/is-same-reference');
const replaceNodeOrTokenAndSpacesBefore = require('./utils/replace-node-or-token-and-spaces-before');

const MESSAGE_ID = 'prefer-at';
const messages = {
	[MESSAGE_ID]: 'Prefer `.at()` method for negative index access.'
};

const selector = [
	'MemberExpression',
	'[optional!=true]',
	'[computed=true]',
	'[property.type="BinaryExpression"]',
	'[property.operator="-"]',
	'[property.left.type="MemberExpression"]',
	'[property.left.optional!=true]',
	'[property.left.computed=false]',
	'[property.left.property.type="Identifier"]',
	'[property.left.property.name="length"]'
].join('')

/** @param {import('eslint').Rule.RuleContext} context */
const create = context => {
	return {
		[selector](node) {
			const array = node.object;
			const lengthObject = node.property.left.object;
			if (!isSameReference(array, lengthObject)) {
				return;
			}

			const offset = node.property.right;
			const staticResult = getStaticValue(offset, context.getScope());
			if (
				!staticResult ||
				!Number.isInteger(staticResult.value) ||
				staticResult.value < 1
			) {
				return;
			}

			context.report({
				node: node.property,
				messageId: MESSAGE_ID,
				/** @param {import('eslint').Rule.RuleFixer} fixer */
				* fix(fixer) {
					yield * replaceNodeOrTokenAndSpacesBefore(node.property.left, '', fixer, context.getSourceCode());
				}
			});
		}
	}
};

const schema = [];

module.exports = {
	create,
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Prefer `.at()` method for negative index access.',
			url: getDocumentationUrl(__filename)
		},
		fixable: 'code',
		schema,
		messages
	}
};
