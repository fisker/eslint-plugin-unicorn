'use strict';
const getDocumentationUrl = require('./utils/get-documentation-url');

const MESSAGE_ID = '{{RULE_ID}}';
const messages = {
	[MESSAGE_ID]: '`{{RULE_ID}}` message.'
};

function create(context) {
	return {
		Literal(node) {
			context.report({
				node,
				messageId: MESSAGE_ID,
				data: {},
				fix: fixer => fixer.replaceText(node, optimized)
			});
		}
	}
}

const schema = [];

module.exports = {
	meta: {
		type: 'problem | suggestion | layout',
		docs: {
			description: '',
			category: '',
			recommended: true,
			url: getDocumentationUrl(__filename),
			suggestion: false
		},
		fixable: 'code | whitespace',
		schema,
		deprecated: false,
		replacedBy: [],
		messages
	},
	create,
};
