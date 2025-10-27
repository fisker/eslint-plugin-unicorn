// Replace `StringLiteral` node with raw text
const replaceStringLiteralRaw = (node, raw, context, fixer) =>
	fixer.replaceTextRange(
		// Ignore quotes and backticks
		[
			context.sourceCode.getRange(node)[0] + 1,
			context.sourceCode.getRange(node)[1] - 1,
		],
		raw,
	);

export default replaceStringLiteralRaw;
