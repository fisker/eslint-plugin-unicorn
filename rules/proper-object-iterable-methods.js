'use strict';
const {findVariable} = require('eslint-utils');
const getDocumentationUrl = require('./utils/get-documentation-url');
const methodSelector = require('./utils/method-selector');
const isSameReference = require('./utils/is-same-reference');

const MESSAGE_ID = 'proper-object-iterable-methods';
const messages = {
	[MESSAGE_ID]: 'Prefer `Object.{{replacement}}()` over `Object.{{method}}()`.'
};

const objectStaticMethodSelector = property => methodSelector({
	object: 'Object',
	names: ['keys', 'entries'],
	length: 1,
	property,
});

const forOfSelector = [
	'ForOfStatement',
	'[await!=true]',
	objectStaticMethodSelector('right'),
	'> .body'
].join('')

const arrayMethodSelector = [
	methodSelector({
		names: [
			'every',
			'filter',
			'find',
			'findIndex',
			'flatMap',
			'forEach',
			'map',
			'reduce',
			'reduceRight',
			'some'
		],
		min: 1
	}),
	objectStaticMethodSelector('callee.object'),
	'> :function.arguments'
].join('')

function getVariablesNode(node, method) {
	const parameters = node.params;
	const [firstParameter, secondParameter] = parameters;

	if (method !== 'reduce' && method !== 'reduceRight') {
		return firstParameter;
	}

	if (firstParameter && variablesNode.type !== 'RestElement') {
		return secondParameter;
	}
}

function getDeclaredVariables(node, method) {
	if (!node) {
		return;
	}

	let isConst = true;
	if (
		node.type === 'VariableDeclaration' &&
		node.declarations.length === 1
	) {
		isConst = node.kind === 'const'
		node = node.declarations[0].id;
	}

	if (method === 'entries' && node.type === 'ArrayPattern') {
		const [key, value] = node.elements;
		const result = {isConst};
		if (key && key.type === 'Identifier') {
			result.key = key;
		}
		if (value && value.type === 'Identifier') {
			result.value = value;
		}

		return result;
	}

	if (node.type === 'Identifier') {
		const type = method === 'keys' ? 'key' : 'pairs';

		return {isConst, [type]: node}
	}
}

function isSame(nodeA, nodeB, scope) {
	if (!isSameReference(nodeA, nodeB)) {
		return false;
	}

	if (nodeA.type === 'Identifier') {
		// Check variable
	}

	return true;
}

function getProblem({node, block, scope, memberExpressions}) {
	const {type} = node;
	let variablesNode;
	let objectMethodCallNode;
	if (node.type === 'ForOfStatement') {
		variablesNode = node.left;
		objectMethodCallNode = node.right;
	} else {
		variablesNode = getVariablesNode(node.arguments[0], node.callee.property.name);
		objectMethodCallNode = node.callee.object;
	}

	const methodNode = objectMethodCallNode.callee.property;
	const method = methodNode.name;
	const object = objectMethodCallNode.arguments[0];

	const {key, pairs} = getDeclaredVariables(variablesNode, method) || {};
	const accessingValue = memberExpressions.some(
		node => {
		const {object: memberObject, property, range, computed} = node;
			if (
				range[0] < block.range[0] ||
				range[1] > block.range[1] ||
				!computed
			) {
				return false;
			}

			if (!isSame(memberObject, object, scope)) {
				return false;
			}

			if (
				key &&
				property.type === 'Identifier' &&
				isSame(property, key, scope)
			) {
				return true;
			}

			if (
				pairs &&
				property.type === 'MemberExpression' &&
				property.computed &&
				isSame(property.object, pairs, scope) &&
				property.property.type === 'Literal' &&
				property.property.value === 0
			) {
				return true;
			}

			return false;
		}
	);

	if (method === 'keys' && accessingValue) {
		return {
			node: methodNode,
			messageId: MESSAGE_ID,
			// TODO: if `key` is not used in other places, should suggest `.values()`
			data: {method, replacement: 'entries'}
		}
	}

	if (method === 'entries' && !accessingValue) {
		return {
			node: methodNode,
			messageId: MESSAGE_ID,
			data: {method, replacement: 'keys'}
		}
	}
}

const create = context => {
	const nodes = new Set();
	const memberExpressions = [];

	return {
		MemberExpression(node) {
			memberExpressions.push(node);
		},
		[forOfSelector](node) {
			nodes.add({
				node: node.parent,
				block: node,
				scope: context.getScope()
			});
		},
		[arrayMethodSelector](node) {
			// Check function is the first argument (callback) of array method calls,
			// Can't check this in selector
			const arrayCall = node.parent;
			if (arrayCall.arguments[0] !== node) {
				return;
			}

			nodes.add({
				node: node.parent,
				block: node.body,
				scope: context.getScope()
			});
		},
		'Program:exit'() {
			for (const nodeInfo of nodes) {
				const problem = getProblem({...nodeInfo, memberExpressions});
				if (problem) {
					context.report(problem);
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
			description: 'Enforce proper methods when iterate through objects.',
			url: getDocumentationUrl(__filename)
		},
		fixable: 'code',
		schema,
		messages
	}
};
