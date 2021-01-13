'use strict';
const path = require('path');
const packageJson = require('../../package');

const repoUrl = 'https://github.com/sindresorhus/eslint-plugin-unicorn';

module.exports = filename => {
	const ruleName = path.basename(filename, filename.endsWith('.mjs') ? '.mjs' : '.js');
	return `${repoUrl}/blob/v${packageJson.version}/docs/rules/${ruleName}.md`;
};
