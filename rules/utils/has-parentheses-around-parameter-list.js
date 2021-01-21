'use strict';
const {isOpeningParenToken} = require('eslint-utils');

/**
Check if function has parentheses around parameters list.

@param {Node} node - The AST node to check.
@param {SourceCode} sourceCode - The source code object.
@returns {boolean}
*/
function hasParenthesesAroundParameterList(node, sourceCode) {
	if (
		node.type !== 'ArrowFunctionExpression' ||
		node.params.length !== 1
	) {
		return true;
	}

	const [onlyArgument] = node.params;
	return isOpeningParenToken(sourceCode.getTokenBefore(onlyArgument));
}

module.exports = hasParenthesesAroundParameterList;
