'use strict';
const eslintTemplateVisitor = require('eslint-template-visitor');
const getDocumentationUrl = require('./utils/get-documentation-url');

const templates = eslintTemplateVisitor();

const objectVariable = templates.variable();
const argumentsVariable = templates.spreadVariable();

const substrCallTemplate = templates.template`${objectVariable}.substr(${argumentsVariable})`;
const substringCallTemplate = templates.template`${objectVariable}.substring(${argumentsVariable})`;

const isLiteralNumber = node => node.type === 'Literal' && typeof node.value === 'number'

const getNumericValue = node => {
	if (isLiteralNumber(node)) {
		return node.value;
	}

	if (node.type === 'UnaryExpression' && node.operator === '-') {
		return 0 - getNumericValue(node.argument);
	}
};

const isLengthProperty = node => (
	node &&
	node.type === 'MemberExpression' &&
	node.computed === false &&
	node.property.type === 'Identifier' &&
	node.property.name === 'length'
);

const getSubstrFixerArguments = (sourceCode, argumentNodes) => {
	const {length} = argumentNodes;

	if (length > 2) {
		return;
	}

	if (length === 0) {
		return [];
	}

	const firstArgument = sourceCode.getText(argumentNodes[0]);

	if (length === 1) {
		return [firstArgument];
	}

	const secondArgument = sourceCode.getText(argumentNodes[1]);

	if (firstArgument === '0') {
		return [firstArgument, secondArgument];
	}

	if (argumentNodes.every(node => isLiteralNumber(node))) {
		const [firstValue, secondValue] = argumentNodes.map(({value}) => value)
		return [
			firstValue,
			firstValue + secondValue
		]
	}

	if (argumentNodes[0].type === 'Literal') {
		return [firstArgument, firstArgument + ' + ' + secondArgument];
	}
};

const getSubstringFixerArguments = (sourceCode, argumentNodes) => {
	const {length} = argumentNodes;

	if (length > 2) {
		return;
	}

	if (length === 0) {
		return [];
	}

	const firstArgument = sourceCode.getText(argumentNodes[0]);
	const firstNumber = getNumericValue(argumentNodes[0]);

	if (length === 1) {
		if (firstNumber !== undefined) {
			return [Math.max(0, firstNumber)];
		}

		if (isLengthProperty(argumentNodes[0])) {
			return [firstArgument];
		}

		return [`Math.max(0, ${firstArgument})`];
	}

	const secondArgument = sourceCode.getText(argumentNodes[1]);
	const secondNumber = getNumericValue(argumentNodes[1]);

	if (firstNumber !== undefined && secondNumber !== undefined) {
		const sliceArguments = [firstNumber, secondNumber].map(number => Math.max(0, number));

		if (firstNumber > secondNumber) {
			sliceArguments.reverse();
		}

		return sliceArguments;
	}

	if (firstNumber === 0 || secondNumber === 0) {
		return [
			0,
			`Math.max(0, ${firstNumber === 0 ? secondArgument : firstArgument})`
		];
	}

	// As values aren't Literal, we can not know whether secondArgument will become smaller than the first or not, causing an issue:
	//   .substring(0, 2) and .substring(2, 0) returns the same result
	//   .slice(0, 2) and .slice(2, 0) doesn't return the same result
	// There's also an issue with us now knowing whether the value will be negative or not, due to:
	//   .substring() treats a negative number the same as it treats a zero.
	// The latter issue could be solved by wrapping all dynamic numbers in Math.max(0, <value>), but the resulting code would not be nice
};

const create = context => {
	const sourceCode = context.getSourceCode();

	return templates.visitor({
		[substrCallTemplate](node) {
			const objectNode = substrCallTemplate.context.getMatch(objectVariable);
			const argumentNodes = substrCallTemplate.context.getMatch(argumentsVariable);

			const problem = {
				node,
				message: 'Prefer `String#slice()` over `String#substr()`.'
			};

			const sliceArguments = getSubstrFixerArguments(sourceCode, argumentNodes);

			if (sliceArguments) {
				const objectText = objectNode.type === 'LogicalExpression' ?
					`(${sourceCode.getText(objectNode)})` :
					sourceCode.getText(objectNode);

				problem.fix = fixer => fixer.replaceText(node, `${objectText}.slice(${sliceArguments.join(', ')})`);
			}

			context.report(problem);
		},

		[substringCallTemplate](node) {
			const objectNode = substringCallTemplate.context.getMatch(objectVariable);
			const argumentNodes = substringCallTemplate.context.getMatch(argumentsVariable);

			const problem = {
				node,
				message: 'Prefer `String#slice()` over `String#substring()`.'
			};

			const sliceArguments = getSubstringFixerArguments(sourceCode, argumentNodes);

			if (sliceArguments) {
				const objectText = objectNode.type === 'LogicalExpression' ?
					`(${sourceCode.getText(objectNode)})` :
					sourceCode.getText(objectNode);

				problem.fix = fixer => fixer.replaceText(node, `${objectText}.slice(${sliceArguments.join(', ')})`);
			}

			context.report(problem);
		}
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
