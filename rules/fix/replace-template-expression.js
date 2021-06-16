'use strict';

function replaceTemplateExpression(fixer, node, replacement) {
	const templateLiteral = node.parent;
	const {expressions, quasis: templateElements} = templateLiteral;
	const index = expressions.indexOf(node);

	const start = templateElements[index].range[1] - 2;
	const end = templateElements[index + 1].range[0] + 1;

	return fixer.replaceTextRange([start, end], replacement);
}

module.exports = replaceTemplateExpression;
