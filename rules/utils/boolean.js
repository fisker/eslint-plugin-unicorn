'use strict';

const isLogicalExpression = require('./is-logical-expression.js');

const isLogicNot = node =>
	node.type === 'UnaryExpression' &&
	node.operator === '!';
const isLogicNotArgument = node =>
	isLogicNot(node.parent) &&
	node.parent.argument === node;
const isBooleanCallArgument = node =>
	isBooleanCall(node.parent) &&
	node.parent.arguments[0] === node;
const isBooleanCall = node =>
	node.type === 'CallExpression' &&
	!node.optional &&
	node.callee.type === 'Identifier' &&
	node.callee.name === 'Boolean' &&
	node.arguments.length === 1;
const isObjectIsCall = node =>
	node.type === 'CallExpression' &&
	!node.optional &&
	node.callee.type === 'MemberExpression' &&
	!node.callee.computed &&
	!node.callee.optional &&
	node.callee.object.type === 'Identifier' &&
	node.callee.object.name === 'Object' &&
	node.callee.property.type === 'Identifier' &&
	node.callee.property.name === 'is';
const isVueBooleanAttributeValue = node =>
	node.type === 'VExpressionContainer' &&
	node.parent.type === 'VAttribute' &&
	node.parent.directive &&
	node.parent.value === node &&
	node.parent.key.type === 'VDirectiveKey' &&
	node.parent.key.name.type === 'VIdentifier' &&
	(
		node.parent.key.name.rawName === 'if' ||
		node.parent.key.name.rawName === 'else-if' ||
		node.parent.key.name.rawName === 'show'
	);
const isBooleanLiteral = node =>
	node.type === 'Literal' &&
	typeof node.value === 'boolean';
// https://github.com/estree/estree/blob/master/es5.md#binaryoperator
const comparisonOperators = new Set([
	'==',
	'!=',
	'===',
	'!==',
	'<',
	'<=',
	'>',
	'>=',
	'in',
	'instanceof'
]);
const isComparison = node =>
	node.type === 'BinaryExpression' &&
	comparisonOperators.has(node.operator);

/**
Check if the value of node is a `boolean`.

@param {Node} node
@returns {boolean}
*/
function isBooleanNode(node) {
	if (
		isLogicNot(node) ||
		isLogicNotArgument(node) ||
		isBooleanCall(node) ||
		isBooleanCallArgument(node) ||
		isBooleanLiteral(node) ||
		isComparison(node) ||
		isObjectIsCall(node)
	) {
		return true;
	}

	const {parent} = node;
	if (isVueBooleanAttributeValue(parent)) {
		return true;
	}

	if (
		(
			parent.type === 'IfStatement' ||
			parent.type === 'ConditionalExpression' ||
			parent.type === 'WhileStatement' ||
			parent.type === 'DoWhileStatement' ||
			parent.type === 'ForStatement'
		) &&
		parent.test === node
	) {
		return true;
	}

	if (isLogicalExpression(parent)) {
		return isBooleanNode(parent);
	}

	return false;
}

/**
Get the boolean type-casting ancestor.

@typedef {{ node: Node, isNegative: boolean }} Result

@param {Node} node
@returns {Result}
*/
function getBooleanAncestor(node) {
	let isNegative = false;
	// eslint-disable-next-line no-constant-condition
	while (true) {
		if (isLogicNotArgument(node)) {
			isNegative = !isNegative;
			node = node.parent;
		} else if (isBooleanCallArgument(node)) {
			node = node.parent;
		} else {
			break;
		}
	}

	return {node, isNegative};
}

module.exports = {isBooleanNode, getBooleanAncestor};
