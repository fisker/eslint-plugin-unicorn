'use strict';
const {getStaticValue} = require('eslint-utils');

/**
Get the property value of a `MemberExpression` node.

@param {Node} node - The `MemberExpression` node.
@param {Scope} [scope] - The scope to start finding the variable. Optional. If this scope was given, it tries to resolve identifier references which are in the given node as much as possible.
*/
function getPropertyName(node, scope) {
	const {type, property, computed} = node;
	/* istanbul ignore next */
	if (type !== 'MemberExpression') {
		return;
	}

	if (!computed) {
		return property.type === 'Identifier' ? property.name : undefined;
	}

	const result = getStaticValue(property, scope);
	return result && result.value;
}

module.exports = getPropertyName;
