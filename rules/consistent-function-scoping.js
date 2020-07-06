'use strict';
const {findVariable} = require('eslint-utils');
const {getFunctionHeadLocation, getFunctionNameWithKind} = require('eslint-utils');
const getDocumentationUrl = require('./utils/get-documentation-url');
const getReferences = require('./utils/get-references');

const MESSAGE_ID = 'consistent-function-scoping';

// https://reactjs.org/docs/hooks-reference.html
const reactHooks = new Set([
	'useState',
	'useEffect',
	'useContext',
	'useReducer',
	'useCallback',
	'useMemo',
	'useRef',
	'useImperativeHandle',
	'useLayoutEffect',
	'useDebugValue'
]);
const isReactHook = node =>
	node &&
	node.parent &&
	node.parent.callee &&
	node.parent.callee.type === 'Identifier' &&
	reactHooks.has(node.parent.callee.name);

const isArrowFunctionWithThis = scope =>
	scope.type === 'function' &&
	scope.block &&
	scope.block.type === 'ArrowFunctionExpression' &&
	(scope.thisFound || scope.childScopes.some(scope => isArrowFunctionWithThis(scope)));

const iifeFunctionTypes = new Set([
	'FunctionExpression',
	'ArrowFunctionExpression'
]);
const isIife = node => node &&
	iifeFunctionTypes.has(node.type) &&
	node.parent &&
	node.parent.type === 'CallExpression' &&
	node.parent.callee === node;

function canMoveToUpperScope(node, scope) {
	if (!scope || isArrowFunctionWithThis(scope)) {
		return false;
	}
	const parentScope = scope.upper;

	if (
		parentScope.type === 'global' ||
		parentScope.type === 'module' ||
		isReactHook(parentScope.block) ||
		isIife(parentScope.block)
	) {
		return false;
	}

	const referencesInParentScope = getReferences(parentScope);
	const references = getReferences(scope);
	const referencesInParentScopeButNotInFunction = referencesInParentScope.filter(reference => !references.includes(reference))
	const variablesInParentScopeButNotInFunction = referencesInParentScopeButNotInFunction.map(({resolved}) => resolved);
	const variables = references.map(({resolved}) => resolved);

	return !variables.some(variable => {
		if (!variable) {
			return false
		}

		if (variablesInParentScopeButNotInFunction.includes(variable)) {
			return true
		}


		const scope = variable.scope;


		// TODO: fix this function self compare
		if (variable.identifiers[0] === node.id) {
			return false
		}

		return (scope === parentScope) || (scope === parentScope.upper && (parentScope.upper.type ==='for' || parentScope.upper.type ==='catch'));
	});
}

const create = context => {
	const sourceCode = context.getSourceCode();
	const {scopeManager} = sourceCode;

	const functions = [];
	let hasJsx = false;

	return {
		'ArrowFunctionExpression, FunctionDeclaration': node => functions.push(node),
		JSXElement: () => {
			// Turn off this rule if we see a JSX element because scope
			// references does not include JSXElement nodes.
			hasJsx = true;
		},
		':matches(ArrowFunctionExpression, FunctionDeclaration):exit': node => {
			if (!hasJsx && canMoveToUpperScope(node, context.getScope())) {
				context.report({
					node,
					loc: getFunctionHeadLocation(node, sourceCode),
					messageId: MESSAGE_ID,
					data: {
						functionNameWithKind: getFunctionNameWithKind(node)
					}
				});
			}

			functions.pop();
			if (functions.length === 0) {
				hasJsx = false;
			}
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
		messages: {
			[MESSAGE_ID]: 'Move {{functionNameWithKind}} to the outer scope.'
		}
	}
};
