#!/usr/bin/env node
'use strict';
const {CLIEngine} = require('eslint');
const unicorn = require('../..');

const {configs: {recommended}} = unicorn;
const {rules} = recommended;

const cli = new CLIEngine({
	...recommended,
	rules: {
		...rules,

		// TODO: remove this override, when `prevent-abbreviations` default options changes
		'unicorn/prevent-abbreviations': [
			'error',
			{
				checkProperties: false
			}
		],

		// TODO: remove this override, when #391 is fixed
		'consistent-function-scoping': 'off',
	},
	useEslintrc: false
});

cli.addPlugin('eslint-plugin-unicorn', unicorn);

const report = cli.executeOnFiles([process.argv[2] || '.']);

const formatter = cli.getFormatter();

console.log(formatter(report.results));

process.exit(report.errorCount);
