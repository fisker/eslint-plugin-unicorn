'use strict';

function getSiblings(node, sourceCode) {
	const {parent} = node;
	const visitorKeys = sourceCode.visitorKeys[parent.type] || Object.keys(parent);

	for (const property of visitorKeys) {
		const value = parent[property];
		if (Array.isArray(value) && value.includes(node)) {
			return value;
		}
	}

	return [];
}

module.exports = {getSiblings};

