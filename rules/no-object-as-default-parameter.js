'use strict';
const getDocumentationUrl = require('./utils/get-documentation-url');

const MESSAGE_ID = 'noObjectAsDefaultParameter';

const objectParameterSelector = [
	':function',
	'>',
	'AssignmentPattern.params',
	'[right.type="ObjectExpression"]',
	'[right.properties.length>0]',
	'>',
	'Identifier.left'
].join('');

const create = context => {
	return {
		[objectParameterSelector]: node => {
			context.report({
				node: node,
				messageId: MESSAGE_ID,
				data: {parameter: node.name}
			});
		}
	};
};

module.exports = {
	create,
	meta: {
		type: 'problem',
		docs: {
			url: getDocumentationUrl(__filename)
		},
		messages: {
			[MESSAGE_ID]: 'Do not use an object literal as default for parameter `{{parameter}}`.'
		}
	}
};
