'use strict';
const {getStaticValue} = require('eslint-utils');
const escapeTemplateElementRaw = require('./utils/escape-template-element-raw.js');
const {replaceTemplateExpression} = require('./fix/index.js');
const {getParenthesizedText, isParenthesized} = require('./utils/parentheses.js');

const MESSAGE_ID_STRING_AS_EXPRESSION = 'string-as-expression';
const MESSAGE_ID_ONLY_EXPRESSION = 'only-expression';
const messages = {
	[MESSAGE_ID_STRING_AS_EXPRESSION]: 'Do not use string literal as expression.',
	[MESSAGE_ID_ONLY_EXPRESSION]: 'Do not use template literal only have one expression.',
};

const unquoteStringLiteral = text => {
	const quote = text.charAt(0);
	return text.slice(1, -1).replace(new RegExp(`\\\\${quote}`, 'g'), quote);
};

const isStringLiteral = node => node.type === 'Literal' && typeof node.value === 'string';

/** @param {import('eslint').Rule.RuleContext} context */
const create = context => {
	const sourceCode = context.getSourceCode();

	return {
		* 'TemplateLiteral[expressions.length>0]:not(TaggedTemplateExpression > .quasi)'(templateLiteral) {
			const {expressions, quasis: templateElements} = templateLiteral;
			if (
				expressions.length === 1 &&
				!isStringLiteral(expressions[0]) &&
				templateElements.every(templateElement => templateElement.value.cooked === '')
			) {
				const [node] = expressions;
				yield {
					node,
					messageId: MESSAGE_ID_ONLY_EXPRESSION,
					fix: fixer => {
						let text = getParenthesizedText(node, sourceCode);
						if (!isParenthesized(node, sourceCode) && node.type === 'SequenceExpression') {
							text = `(${text})`;
						}

						const staticValue = getStaticValue(node, context.getScope());
						if (staticValue && typeof staticValue.value === 'string') {
							// TODO: Need check semi here
							return fixer.replaceText(templateLiteral, text);
						}

						return fixer.replaceText(templateLiteral, `String(${text})`);
					}
				}

				return;
			}


			for (const [index, node] of expressions.entries()) {
				if (isStringLiteral(node)) {
					yield {
						node,
						messageId: MESSAGE_ID_STRING_AS_EXPRESSION,
						fix: fixer => replaceTemplateExpression(
							fixer,
							node,
							escapeTemplateElementRaw(unquoteStringLiteral(node.raw))
						)
					}
				}
			}
		}
	}
};

const schema = [];

module.exports = {
	create,
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Forbid useless interpolation in template strings.'
		},
		fixable: 'code',
		schema,
		messages
	}
};
