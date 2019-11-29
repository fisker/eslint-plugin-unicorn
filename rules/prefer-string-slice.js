'use strict';
const eslintTemplateVisitor = require('eslint-template-visitor');
const getDocumentationUrl = require('./utils/get-documentation-url');

const templates = eslintTemplateVisitor();

const objectVariable = templates.variable();
const argumentsVariable = templates.spreadVariable();
const isLiteralNumber = node => node && node.type === 'Literal' && typeof node.value === 'number';

const getNumericValue = node => {
	if (isLiteralNumber(node)) {
		return node.value;
	}

	if (node.type === 'UnaryExpression' && node.operator === '-') {
		return -getNumericValue(node.argument);
	}
};

// This handles cases where the argument is very likely to be a number, such as `.substring('foo'.length)`.
const isLengthProperty = node => (
	node &&
	node.type === 'MemberExpression' &&
	node.computed === false &&
	node.property.type === 'Identifier' &&
	node.property.name === 'length'
);

const isLikelyNumeric = node => isLiteralNumber(node) || isLengthProperty(node);

const methods = new Map([
	[
		'substr',
		(sourceCode, argumentNodes) => {
			const argumentTexts = argumentNodes.map(node => sourceCode.getText(node));

			if (argumentNodes.length < 2) {
				return argumentTexts;
			}

			const [firstArgument, secondArgument] = argumentTexts;

			if (firstArgument === '0') {
				return argumentTexts;
			}

			if (argumentNodes.every(node => isLiteralNumber(node))) {
				return [firstArgument, argumentNodes[0].value + argumentNodes[1].value];
			}

			if (argumentNodes.every(node => isLikelyNumeric(node))) {
				return [firstArgument, firstArgument + ' + ' + secondArgument];
			}
		}
	],
	[
		'substring',
		(sourceCode, argumentNodes) => {
			if (argumentNodes.length === 0) {
				return [];
			}

			const argumentTexts = argumentNodes.map(node => sourceCode.getText(node));
			const [firstNumber, secondNumber] = argumentNodes.map(node => getNumericValue(node));
			const [firstArgument, secondArgument] = argumentTexts;

			if (argumentNodes.length === 1) {
				if (isLengthProperty(argumentNodes[0])) {
					return [firstArgument];
				}

				if (firstNumber !== undefined) {
					return [Math.max(0, firstNumber)];
				}

				return [`Math.max(0, ${firstArgument})`];
			}

			if (firstNumber === 0 || secondNumber === 0) {
				return [0, `Math.max(0, ${firstNumber === 0 ? secondArgument : firstArgument})`];
			}

			if (firstNumber !== undefined && secondNumber !== undefined) {
				return (firstNumber > secondNumber ? [secondNumber, firstNumber] : [firstNumber, secondNumber])
					.map(value => Math.max(0, value));
			}

			// As values aren't Literal, we can not know whether secondArgument will become smaller than the first or not, causing an issue:
			//   .substring(0, 2) and .substring(2, 0) returns the same result
			//   .slice(0, 2) and .slice(2, 0) doesn't return the same result
			// There's also an issue with us now knowing whether the value will be negative or not, due to:
			//   .substring() treats a negative number the same as it treats a zero.
			// The latter issue could be solved by wrapping all dynamic numbers in Math.max(0, <value>), but the resulting code would not be nice
		}
	]
].map(([method, fixArguments]) => [
	method,
	{
		template: templates.template`${objectVariable}.${method}(${argumentsVariable})`,
		message: `Prefer \`String#slice()\` over \`String#${method}()\`.`,
		fixArguments
	}
]));

const create = context => {
	const sourceCode = context.getSourceCode();
	const substr = methods.get('substr');
	const substring = methods.get('substring');

	const check = (node, {message, template, fixArguments}) => {
		const argumentNodes = template.context.getMatch(argumentsVariable);
		if (argumentNodes.length > 2) {
			return;
		}

		const sliceArguments = fixArguments(sourceCode, argumentNodes);

		let fix;

		if (sliceArguments) {
			const objectNode = template.context.getMatch(objectVariable);
			const objectText = objectNode.type === 'LogicalExpression' ?
				`(${sourceCode.getText(objectNode)})` :
				sourceCode.getText(objectNode);

			fix = fixer => fixer.replaceText(node, `${objectText}.slice(${sliceArguments.join(', ')})`);
		}

		context.report({
			node,
			message,
			fix
		});
	};

	return templates.visitor({
		[substr.template]: node => check(node, substr),
		[substring.template]: node => check(node, substring)
	});
};

module.exports = {
	create,
	meta: {
		type: 'suggestion',
		docs: {
			url: getDocumentationUrl(__filename)
		},
		fixable: 'code'
	}
};
