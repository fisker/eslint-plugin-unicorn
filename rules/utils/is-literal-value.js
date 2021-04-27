'use strict';
module.exports = (node, value) => {
	if (!node || node.type !== 'Literal') {
		return false;
	}

	return value === null ? node.raw === 'null' : node.value === value;
};
