'use strict';
const {isCommaToken, isArrowToken, isClosingParenToken} = require('eslint-utils');
const getDocumentationUrl = require('./utils/get-documentation-url');
const {matches, methodCallSelector} = require('./selectors');
const {getParentheses, getParenthesizedText} = require('./utils/parentheses');
const {isNodeMatches, isNodeMatchesNameOrPath} = require('./utils/is-node-matches');
const {getSiblings} = require('./utils/siblings');

const MESSAGE_ID_REDUCE = 'reduce';
const MESSAGE_ID_FUNCTION = 'function';
const messages = {
	[MESSAGE_ID_REDUCE]: 'Prefer `Object.fromEntries()` over `Array#reduce()`.',
	[MESSAGE_ID_FUNCTION]: 'Prefer `Object.fromEntries()` over `{{functionName}}()`.'
};

const createEmptyObjectSelector = path => {
	const prefix = path ? `${path}.` : '';
	return matches([
		// `{}`
		`[${prefix}type="ObjectExpression"][${prefix}properties.length=0]`,
		// `Object.create(null)`
		[
			methodCallSelector({path, object: 'Object', name: 'create', length: 1}),
			`[${prefix}arguments.0.type="Literal"]`,
			`[${prefix}arguments.0.raw="null"]`
		].join('')
	]);
};

const createArrowCallbackSelector = path => {
	const prefix = path ? `${path}.` : '';
	return [
		`[${prefix}type="ArrowFunctionExpression"]`,
		`[${prefix}async!=true]`,
		`[${prefix}generator!=true]`,
		`[${prefix}params.length>=1]`,
		`[${prefix}params.0.type="Identifier"]`
	].join('');
};

const createPropertySelector = path => {
	const prefix = path ? `${path}.` : '';
	return [
		`[${prefix}type="Property"]`,
		`[${prefix}kind="init"]`,
		`[${prefix}method!=true]`
	].join('');
};

// `foo.bar = baz;`
const createMemberAssignmentExpressionSelector => path => {
	const prefix = path ? `${path}.` : '';
	const prefix = path ? `${path}.` : '';
	return [
		`[${prefix}type="ExpressionStatement"]`,
		`[${prefix}expression.type="AssignmentExpression"]`,
		`[${prefix}expression.left.type="MemberExpression"]`,
		`[${prefix}expression.left.computed!=false]`,
		`[${prefix}expression.left.optional!=true]`,
		`[${prefix}expression.left.object.type="Identifier"]`
	].join('');
};

// - `pairs.reduce(…, {})`
// - `pairs.reduce(…, Object.create(null))`
const arrayReduceWithEmptyObject = [
	methodCallSelector({name: 'reduce', length: 2}),
	createEmptyObjectSelector('arguments.1')
].join('');

const fixableArrayReduceCases = [
	{
		selector: [
			arrayReduceWithEmptyObject,
			// () => Object.assign(object, {key})
			createArrowCallbackSelector('arguments.0'),
			methodCallSelector({path: 'arguments.0.body', object: 'Object', name: 'assign', length: 2}),
			'[arguments.0.body.arguments.0.type="Identifier"]',
			'[arguments.0.body.arguments.1.type="ObjectExpression"]',
			'[arguments.0.body.arguments.1.properties.length=1]',
			createPropertySelector('arguments.0.body.arguments.1.properties.0')
		].join(''),
		test: callback => callback.params[0].name === callback.body.arguments[0].name,
		getProperty: callback => callback.body.arguments[1].properties[0]
	},
	{
		selector: [
			arrayReduceWithEmptyObject,
			// () => ({...object, key})
			createArrowCallbackSelector('arguments.0'),
			'[arguments.0.body.type="ObjectExpression"]',
			'[arguments.0.body.properties.length=2]',
			'[arguments.0.body.properties.0.type="SpreadElement"]',
			'[arguments.0.body.properties.0.argument.type="Identifier"]',
			createPropertySelector('arguments.0.body.properties.1')
		].join(''),
		test: callback => callback.params[0].name === callback.body.properties[0].argument.name,
		getProperty: callback => callback.body.properties[1]
	}
];

// `_.flatten(array)`
const lodashFromPairsFunctions = [
	'_.fromPairs',
	'lodash.fromPairs'
];
const anyCall = [
	'CallExpression',
	'[optional!=true]',
	'[arguments.length=1]',
	'[arguments.0.type!="SpreadElement"]',
	' > .callee'
].join('');

// - `{const,let,var} foo = {}`
// - `{const,let,var} foo = Object.create(null)`
const emptyObjectVariableSelector = [
	'VariableDeclaration',
	'[declarations.length=1]',
	'[declarations.0.type="VariableDeclarator"]',
	'[declarations.0.id.type="Identifier"]',
	createEmptyObjectSelector('declarations.0.init')
].join('');

// - `for (…) foo.bar = baz;`
// - `for (…) {foo.bar = baz;}`
const createLoopBodySelector = path => {
	const prefix = path ? `${path}.` : '';
	return ;
};
const forOfSelector = [
	'ForOfStatement',
	matches([
		createMemberAssignmentExpressionSelector('body'),
		[
			`[body.type="BlockStatement"]`,
			'[body.length=1]',
			createMemberAssignmentExpressionSelector('body.body.0')
		].join('');
	])
].join('');

function fixReduceAssignOrSpread({sourceCode, node, property}) {
	function removeInitObject(fixer) {
		const initObject = node.arguments[1];
		const parentheses = getParentheses(initObject, sourceCode);
		const firstToken = parentheses[0] || initObject;
		const lastToken = parentheses[parentheses.length - 1] || initObject;
		const startToken = sourceCode.getTokenBefore(firstToken);
		const [start] = startToken.range;
		const [, end] = lastToken.range;
		return fixer.replaceTextRange([start, end], '');
	}

	function * removeFirstParameter(fixer) {
		const parameters = node.arguments[0].params;
		const [firstParameter] = parameters;
		const tokenAfter = sourceCode.getTokenAfter(firstParameter);

		if (isCommaToken(tokenAfter)) {
			yield fixer.remove(tokenAfter);
		}

		let shouldAddParentheses = false;
		if (parameters.length === 1) {
			const arrowToken = sourceCode.getTokenAfter(firstParameter, isArrowToken);
			const tokenBeforeArrowToken = sourceCode.getTokenBefore(arrowToken);

			if (!isClosingParenToken(tokenBeforeArrowToken)) {
				shouldAddParentheses = true;
			}
		}

		yield fixer.replaceText(firstParameter, shouldAddParentheses ? '()' : '');
	}

	function getKeyValueText() {
		const {key, value} = property;
		let keyText = getParenthesizedText(key, sourceCode);
		const valueText = getParenthesizedText(value, sourceCode);

		if (!property.computed && key.type === 'Identifier') {
			keyText = `'${keyText}'`;
		}

		return {keyText, valueText};
	}

	function * replaceFunctionBody(fixer) {
		const functionBody = node.arguments[0].body;
		const {keyText, valueText} = getKeyValueText();
		yield fixer.replaceText(functionBody, `[${keyText}, ${valueText}]`);

		for (const parentheses of getParentheses(functionBody, sourceCode)) {
			yield fixer.remove(parentheses);
		}
	}

	return function * (fixer) {
		// Wrap `array.reduce()` with `Object.fromEntries()`,
		yield fixer.insertTextBefore(node, 'Object.fromEntries(');
		yield fixer.insertTextAfter(node, ')');

		// Switch `.reduce` to `.map`
		yield fixer.replaceText(node.callee.property, 'map');

		// Remove empty object
		yield removeInitObject(fixer);

		// Remove the first parameter
		yield * removeFirstParameter(fixer);

		// Replace function body
		yield * replaceFunctionBody(fixer);
	};
}

const getAssignmentExpression = forOfStatement => {
	const {body} = forOfStatement;
	const {expression} = body.type === 'ExpressionStatement' ? body : body.body[0];
	return expression;
};

/** @param {import('eslint').Rule.RuleContext} context */
function create(context) {
	const {functions: configFunctions} = {
		functions: [],
		...context.options[0]
	};
	const functions = [...configFunctions, ...lodashFromPairsFunctions];
	const sourceCode = context.getSourceCode();
	const arrayReduce = new Map();
	const emptyObjectDeclarations = [];
	const forOfStatements = [];
	const listeners = {};

	function getSiblingForOfStatement(declaration) {
		const siblings = getSiblings(declaration, sourceCode);
		const index = siblings.indexOf(declaration);
		if (index === -1) {
			return;
		}
		const siblingForOfStatements = siblings.slice(index + 1).filter(node => forOfStatements.includes(node));
		if (siblingForOfStatements.length === 0) {
			return;
		}

		const variable = context.getDeclaredVariables(declaration);
		siblingForOfStatements = siblingForOfStatements.filter(forOfStatement => {
			const assignment = getAssignmentExpression(forOfStatement);
			const {object} = assignment.left;
			return object.name === object.name && variable.references.includes(object)
		});
		if (siblingForOfStatements.length === 0) {
			return;
		}

		const [firstForOfStatement] = siblingForOfStatements;

		return {
			node: firstForOfStatement,
			isAbove: siblings.indexOf(firstForOfStatement) === index + 1
		};
	}

	function checkEmptyObjectDeclaration(node) {
		const {
			node: forOfStatement,
			isAbove
		} = getSiblingForOfStatement(node) || {};

		if (!forOfStatement) {
			return;
		}

		function getKeyValue() {
		}

	}

	for (const {selector, test, getProperty} of fixableArrayReduceCases) {
		listeners[selector] = function (node) {
			// If this listener exit without adding fix, the `arrayReduceWithEmptyObject` listener
			// should still add it into the `arrayReduce` map, to be safer, add it here too
			// eslint-disable-next-line unicorn/no-null
			arrayReduce.set(node, null);

			const [callbackFunction] = node.arguments;
			if (!test(callbackFunction)) {
				return;
			}

			const [firstParameter] = callbackFunction.params;
			const variables = context.getDeclaredVariables(callbackFunction);
			const firstParameterVariable = variables.find(variable => variable.identifiers.length === 1 && variable.identifiers[0] === firstParameter);
			if (!firstParameterVariable || firstParameterVariable.references.length !== 1) {
				return;
			}

			arrayReduce.set(
				node,
				// The fix function
				fixReduceAssignOrSpread({
					sourceCode,
					node,
					property: getProperty(callbackFunction)
				})
			);
		};
	}

	listeners[arrayReduceWithEmptyObject] = function (node) {
		if (!arrayReduce.has(node)) {
			// eslint-disable-next-line unicorn/no-null
			arrayReduce.set(node, null);
		}
	};

	listeners[emptyObjectVariableSelector] = node => emptyObjectDeclarations.push(node);
	listeners[emptyObjectVariableSelector] = node => forOfStatements.push(node);

	listeners[anyCall] = function (node) {
		if (!isNodeMatches(node, functions)) {
			return;
		}

		const functionName = functions.find(nameOrPath => isNodeMatchesNameOrPath(node, nameOrPath)).trim();
		context.report({
			node,
			messageId: MESSAGE_ID_FUNCTION,
			data: {functionName},
			fix: fixer => fixer.replaceText(node, 'Object.fromEntries')
		});
	};

	listeners['Program:exit'] = function () {
		for (const [node, fix] of arrayReduce.entries()) {
			context.report({
				node: node.callee.property,
				messageId: MESSAGE_ID_REDUCE,
				fix
			});
		}

		for (const node of emptyObjectDeclarations) {
			checkEmptyObjectDeclarations(node);
		}
	};

	return listeners;
}

const schema = [
	{
		type: 'object',
		properties: {
			functions: {
				type: 'array',
				uniqueItems: true
			}
		},
		additionalProperties: false
	}
];

module.exports = {
	create,
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Prefer using `Object.fromEntries(…)` to transform a list of key-value pairs into an object.',
			url: getDocumentationUrl(__filename)
		},
		fixable: 'code',
		schema,
		messages
	}
};
