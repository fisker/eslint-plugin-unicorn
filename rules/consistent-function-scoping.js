'use strict';
const {findVariable} = require('eslint-utils');
const {getFunctionHeadLocation, getFunctionNameWithKind} = require('eslint-utils');
const getDocumentationUrl = require('./utils/get-documentation-url');
const getReferences = require('./utils/get-references');

const MESSAGE_ID = 'consistent-function-scoping';

const isSameScope = (scope1, scope2) =>
	scope1 && scope2 && (scope1 === scope2 || scope1.block === scope2.block);

function checkReferences(scope, parent, scopeManager) {
	const hitReference = references => references.some(reference => {
		if (isSameScope(parent, reference.from)) {
			return true;
		}

		const {resolved} = reference;
		const [definition] = resolved.defs;

		// Skip recursive function name
		if (definition && definition.type === 'FunctionName' && resolved.name === definition.name.name) {
			return false;
		}

		return isSameScope(parent, resolved.scope);
	});

	const hitDefinitions = definitions => definitions.some(definition => {
		const scope = scopeManager.acquire(definition.node);
		return isSameScope(parent, scope);
	});

	// This check looks for neighboring function definitions
	const hitIdentifier = identifiers => identifiers.some(identifier => {
		// Only look at identifiers that live in a FunctionDeclaration
		if (
			!identifier.parent ||
				identifier.parent.type !== 'FunctionDeclaration'
		) {
			return false;
		}

		const identifierScope = scopeManager.acquire(identifier);

		// If we have a scope, the earlier checks should have worked so ignore them here
		if (identifierScope) {
			return false;
		}

		const identifierParentScope = scopeManager.acquire(identifier.parent);
		if (!identifierParentScope) {
			return false;
		}

		// Ignore identifiers from our own scope
		if (isSameScope(scope, identifierParentScope)) {
			return false;
		}

		// Look at the scope above the function definition to see if lives
		// next to the reference being checked
		return isSameScope(parent, identifierParentScope.upper);
	});

	return getReferences(scope)
		.map(({resolved}) => resolved)
		.filter(Boolean)
		.some(variable =>
			hitReference(variable.references) ||
			hitDefinitions(variable.defs) ||
			hitIdentifier(variable.identifiers)
		);
}

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

	const references = getReferences(scope);

	return !references.some(reference => {
		const variable = reference.resolved;
		if (!variable) {
return false
		}

		const scope = variable.scope;


		// TODO: fix this function self compare
		if (variable.identifiers[0] === node.id) {
			return false
		}
console.log(parentScope.upper.type)
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
