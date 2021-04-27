'use strict';
const readPkgUp = require('read-pkg-up');
const semver = require('semver');
const ci = require('ci-info');
const baseRule = require('eslint/lib/rules/no-warning-comments');
const getDocumentationUrl = require('./utils/get-documentation-url');

// `unicorn/` prefix is added to avoid conflicts with core rule
const MESSAGE_ID_AVOID_MULTIPLE_DATES = 'unicorn/avoidMultipleDates';
const MESSAGE_ID_EXPIRED_TODO = 'unicorn/expiredTodo';
const MESSAGE_ID_AVOID_MULTIPLE_PACKAGE_VERSIONS =
	'unicorn/avoidMultiplePackageVersions';
const MESSAGE_ID_REACHED_PACKAGE_VERSION = 'unicorn/reachedPackageVersion';
const MESSAGE_ID_HAVE_PACKAGE = 'unicorn/havePackage';
const MESSAGE_ID_DONT_HAVE_PACKAGE = 'unicorn/dontHavePackage';
const MESSAGE_ID_VERSION_MATCHES = 'unicorn/versionMatches';
const MESSAGE_ID_ENGINE_MATCHES = 'unicorn/engineMatches';
const MESSAGE_ID_REMOVE_WHITESPACE = 'unicorn/removeWhitespaces';
const MESSAGE_ID_MISSING_AT_SYMBOL = 'unicorn/missingAtSymbol';
const messages = {
	[MESSAGE_ID_AVOID_MULTIPLE_DATES]:
		'Avoid using multiple expiration dates in TODO: {{expirationDates}}. {{message}}',
	[MESSAGE_ID_EXPIRED_TODO]:
		'There is a TODO that is past due date: {{expirationDate}}. {{message}}',
	[MESSAGE_ID_REACHED_PACKAGE_VERSION]:
		'There is a TODO that is past due package version: {{comparison}}. {{message}}',
	[MESSAGE_ID_AVOID_MULTIPLE_PACKAGE_VERSIONS]:
		'Avoid using multiple package versions in TODO: {{versions}}. {{message}}',
	[MESSAGE_ID_HAVE_PACKAGE]:
		'There is a TODO that is deprecated since you installed: {{package}}. {{message}}',
	[MESSAGE_ID_DONT_HAVE_PACKAGE]:
		'There is a TODO that is deprecated since you uninstalled: {{package}}. {{message}}',
	[MESSAGE_ID_VERSION_MATCHES]:
		'There is a TODO match for package version: {{comparison}}. {{message}}',
	[MESSAGE_ID_ENGINE_MATCHES]:
		'There is a TODO match for Node.js version: {{comparison}}. {{message}}',
	[MESSAGE_ID_REMOVE_WHITESPACE]:
		'Avoid using whitespace on TODO argument. On \'{{original}}\' use \'{{fix}}\'. {{message}}',
	[MESSAGE_ID_MISSING_AT_SYMBOL]:
		'Missing \'@\' on TODO argument. On \'{{original}}\' use \'{{fix}}\'. {{message}}',
	...baseRule.meta.messages
};

const packageResult = readPkgUp.sync();
const hasPackage = Boolean(packageResult);
const packageJson = hasPackage ? packageResult.packageJson : {};

const packageDependencies = {
	...packageJson.dependencies,
	...packageJson.devDependencies
};

const DEPENDENCY_INCLUSION_RE = /^[+-]\s*@?\S+\/?\S+/;
const VERSION_COMPARISON_RE = /^(?<name>@?\S\/?\S+)@(?<condition>>|>=)(?<version>\d+(?:\.\d+){0,2}(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?)/i;
const PKG_VERSION_RE = /^(?<condition>>|>=)(?<version>\d+(?:\.\d+){0,2}(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?)\s*$/;
const ISO8601_DATE = /\d{4}-\d{2}-\d{2}/;

function parseTodoWithArguments(string, {terms}) {
	const lowerCaseString = string.toLowerCase();
	const lowerCaseTerms = terms.map(term => term.toLowerCase());
	const hasTerm = lowerCaseTerms.some(term => lowerCaseString.includes(term));

	if (!hasTerm) {
		return false;
	}

	const TODO_ARGUMENT_RE = /\[(?<rawArguments>[^}]+)]/i;
	const result = TODO_ARGUMENT_RE.exec(string);

	if (!result) {
		return false;
	}

	const {rawArguments} = result.groups;

	const parsedArguments = rawArguments
		.split(',')
		.map(argument => parseArgument(argument.trim()));

	return createArgumentGroup(parsedArguments);
}

function createArgumentGroup(arguments_) {
	const groups = {};
	for (const {value, type} of arguments_) {
		groups[type] = groups[type] || [];
		groups[type].push(value);
	}

	return groups;
}

function parseArgument(argumentString) {
	if (ISO8601_DATE.test(argumentString)) {
		return {
			type: 'dates',
			value: argumentString
		};
	}

	if (hasPackage && DEPENDENCY_INCLUSION_RE.test(argumentString)) {
		const condition = argumentString[0] === '+' ? 'in' : 'out';
		const name = argumentString.slice(1).trim();

		return {
			type: 'dependencies',
			value: {
				name,
				condition
			}
		};
	}

	if (hasPackage && VERSION_COMPARISON_RE.test(argumentString)) {
		const {groups} = VERSION_COMPARISON_RE.exec(argumentString);
		const name = groups.name.trim();
		const condition = groups.condition.trim();
		const version = groups.version.trim();

		const hasEngineKeyword = name.indexOf('engine:') === 0;
		const isNodeEngine = hasEngineKeyword && name === 'engine:node';

		if (hasEngineKeyword && isNodeEngine) {
			return {
				type: 'engines',
				value: {
					condition,
					version
				}
			};
		}

		if (!hasEngineKeyword) {
			return {
				type: 'dependencies',
				value: {
					name,
					condition,
					version
				}
			};
		}
	}

	if (hasPackage && PKG_VERSION_RE.test(argumentString)) {
		const result = PKG_VERSION_RE.exec(argumentString);
		const {condition, version} = result.groups;

		return {
			type: 'packageVersions',
			value: {
				condition: condition.trim(),
				version: version.trim()
			}
		};
	}

	// Currently being ignored as integration tests pointed
	// some TODO comments have `[random data like this]`
	return {
		type: 'unknowns',
		value: argumentString
	};
}

function parseTodoMessage(todoString) {
	// @example "TODO [...]: message here"
	// @example "TODO [...] message here"
	const argumentsEnd = todoString.indexOf(']');

	const afterArguments = todoString.slice(argumentsEnd + 1).trim();

	// Check if have to skip colon
	// @example "TODO [...]: message here"
	const dropColon = afterArguments[0] === ':';
	return dropColon ? afterArguments.slice(1).trim() : afterArguments;
}

function reachedDate(past) {
	const now = new Date().toISOString().slice(0, 10);
	return Date.parse(past) < Date.parse(now);
}

function tryToCoerceVersion(rawVersion) {
	/* istanbul ignore if: version in `package.json` and comment can't be empty */
	if (!rawVersion) {
		return false;
	}

	let version = String(rawVersion);

	// Remove leading things like `^1.0.0`, `>1.0.0`
	const leadingNoises = [
		'>=',
		'<=',
		'>',
		'<',
		'~',
		'^'
	];
	const foundTrailingNoise = leadingNoises.find(noise => version.startsWith(noise));
	if (foundTrailingNoise) {
		version = version.slice(foundTrailingNoise.length);
	}

	// Get only the first member for cases such as `1.0.0 - 2.9999.9999`
	const parts = version.split(' ');
	/* istanbul ignore if: We don't have this `package.json` to test */
	if (parts.length > 1) {
		version = parts[0];
	}

	/* istanbul ignore if: We don't have this `package.json` to test */
	if (semver.valid(version)) {
		return version;
	}

	try {
		// Try to semver.parse a perfect match while semver.coerce tries to fix errors
		// But coerce can't parse pre-releases.
		return semver.parse(version) || semver.coerce(version);
	} catch {
		/* istanbul ignore next: We don't have this `package.json` to test */
		return false;
	}
}

function semverComparisonForOperator(operator) {
	return {
		'>': semver.gt,
		'>=': semver.gte
	}[operator];
}

const create = context => {
	const options = {
		terms: ['todo', 'fixme', 'xxx'],
		ignore: [],
		ignoreDatesOnPullRequests: true,
		allowWarningComments: true,
		...context.options[0]
	};

	const ignoreRegexes = options.ignore.map(
		pattern => pattern instanceof RegExp ? pattern : new RegExp(pattern, 'u')
	);

	const sourceCode = context.getSourceCode();
	const comments = sourceCode.getAllComments();
	const unusedComments = comments
		.filter(token => token.type !== 'Shebang')
		// Block comments come as one.
		// Split for situations like this:
		// /*
		//  * TODO [2999-01-01]: Validate this
		//  * TODO [2999-01-01]: And this
		//  * TODO [2999-01-01]: Also this
		//  */
		.flatMap(comment =>
			comment.value.split('\n').map(line => ({
				...comment,
				value: line
			}))
		).filter(comment => processComment(comment));

	// This is highly dependable on ESLint's `no-warning-comments` implementation.
	// What we do is patch the parts we know the rule will use, `getAllComments`.
	// Since we have priority, we leave only the comments that we didn't use.
	const fakeContext = {
		...context,
		getSourceCode() {
			return {
				...sourceCode,
				getAllComments() {
					return options.allowWarningComments ? [] : unusedComments;
				}
			};
		}
	};
	const rules = baseRule.create(fakeContext);

	function processComment(comment) {
		if (ignoreRegexes.some(ignore => ignore.test(comment.value))) {
			return;
		}

		const parsed = parseTodoWithArguments(comment.value, options);

		if (!parsed) {
			return true;
		}

		// Count if there are valid properties.
		// Otherwise, it's a useless TODO and falls back to `no-warning-comments`.
		let uses = 0;

		const {
			packageVersions = [],
			dates = [],
			dependencies = [],
			engines = [],
			unknowns = []
		} = parsed;

		if (dates.length > 1) {
			uses++;
			context.report({
				loc: comment.loc,
				messageId: MESSAGE_ID_AVOID_MULTIPLE_DATES,
				data: {
					expirationDates: dates.join(', '),
					message: parseTodoMessage(comment.value)
				}
			});
		} else if (dates.length === 1) {
			uses++;
			const [date] = dates;

			const shouldIgnore = options.ignoreDatesOnPullRequests && ci.isPR;
			if (!shouldIgnore && reachedDate(date)) {
				context.report({
					loc: comment.loc,
					messageId: MESSAGE_ID_EXPIRED_TODO,
					data: {
						expirationDate: date,
						message: parseTodoMessage(comment.value)
					}
				});
			}
		}

		if (packageVersions.length > 1) {
			uses++;
			context.report({
				loc: comment.loc,
				messageId: MESSAGE_ID_AVOID_MULTIPLE_PACKAGE_VERSIONS,
				data: {
					versions: packageVersions
						.map(({condition, version}) => `${condition}${version}`)
						.join(', '),
					message: parseTodoMessage(comment.value)
				}
			});
		} else if (packageVersions.length === 1) {
			uses++;
			const [{condition, version}] = packageVersions;

			const packageVersion = tryToCoerceVersion(packageJson.version);
			const decidedPackageVersion = tryToCoerceVersion(version);

			const compare = semverComparisonForOperator(condition);
			if (packageVersion && compare(packageVersion, decidedPackageVersion)) {
				context.report({
					loc: comment.loc,
					messageId: MESSAGE_ID_REACHED_PACKAGE_VERSION,
					data: {
						comparison: `${condition}${version}`,
						message: parseTodoMessage(comment.value)
					}
				});
			}
		}

		// Inclusion: 'in', 'out'
		// Comparison: '>', '>='
		for (const dependency of dependencies) {
			uses++;
			const targetPackageRawVersion = packageDependencies[dependency.name];
			const hasTargetPackage = Boolean(targetPackageRawVersion);

			const isInclusion = ['in', 'out'].includes(dependency.condition);
			if (isInclusion) {
				const [trigger, messageId] =
					dependency.condition === 'in' ?
						[hasTargetPackage, MESSAGE_ID_HAVE_PACKAGE] :
						[!hasTargetPackage, MESSAGE_ID_DONT_HAVE_PACKAGE];

				if (trigger) {
					context.report({
						loc: comment.loc,
						messageId,
						data: {
							package: dependency.name,
							message: parseTodoMessage(comment.value)
						}
					});
				}

				continue;
			}

			const todoVersion = tryToCoerceVersion(dependency.version);
			const targetPackageVersion = tryToCoerceVersion(targetPackageRawVersion);

			/* istanbul ignore if: Can't test in Node.js */
			if (!hasTargetPackage || !targetPackageVersion) {
				// Can't compare `¯\_(ツ)_/¯`
				continue;
			}

			const compare = semverComparisonForOperator(dependency.condition);

			if (compare(targetPackageVersion, todoVersion)) {
				context.report({
					loc: comment.loc,
					messageId: MESSAGE_ID_VERSION_MATCHES,
					data: {
						comparison: `${dependency.name} ${dependency.condition} ${dependency.version}`,
						message: parseTodoMessage(comment.value)
					}
				});
			}
		}

		const packageEngines = packageJson.engines || {};

		for (const engine of engines) {
			uses++;

			const targetPackageRawEngineVersion = packageEngines.node;
			const hasTargetEngine = Boolean(targetPackageRawEngineVersion);

			/* istanbul ignore if: Can't test in this repo */
			if (!hasTargetEngine) {
				continue;
			}

			const todoEngine = tryToCoerceVersion(engine.version);
			const targetPackageEngineVersion = tryToCoerceVersion(
				targetPackageRawEngineVersion
			);

			const compare = semverComparisonForOperator(engine.condition);

			if (compare(targetPackageEngineVersion, todoEngine)) {
				context.report({
					loc: comment.loc,
					messageId: MESSAGE_ID_ENGINE_MATCHES,
					data: {
						comparison: `node${engine.condition}${engine.version}`,
						message: parseTodoMessage(comment.value)
					}
				});
			}
		}

		for (const unknown of unknowns) {
			// In this case, check if there's just an '@' missing before a '>' or '>='.
			const hasAt = unknown.includes('@');
			const comparisonIndex = unknown.indexOf('>');

			if (!hasAt && comparisonIndex !== -1) {
				const testString = `${unknown.slice(
					0,
					comparisonIndex
				)}@${unknown.slice(comparisonIndex)}`;

				if (parseArgument(testString).type !== 'unknowns') {
					uses++;
					context.report({
						loc: comment.loc,
						messageId: MESSAGE_ID_MISSING_AT_SYMBOL,
						data: {
							original: unknown,
							fix: testString,
							message: parseTodoMessage(comment.value)
						}
					});
					continue;
				}
			}

			const withoutWhitespace = unknown.replace(/ /g, '');

			if (parseArgument(withoutWhitespace).type !== 'unknowns') {
				uses++;
				context.report({
					loc: comment.loc,
					messageId: MESSAGE_ID_REMOVE_WHITESPACE,
					data: {
						original: unknown,
						fix: withoutWhitespace,
						message: parseTodoMessage(comment.value)
					}
				});
				continue;
			}
		}

		return uses === 0;
	}

	return {
		Program() {
			rules.Program(); // eslint-disable-line new-cap
		}
	};
};

const schema = [
	{
		type: 'object',
		properties: {
			terms: {
				type: 'array',
				items: {
					type: 'string'
				}
			},
			ignore: {
				type: 'array',
				uniqueItems: true
			},
			ignoreDatesOnPullRequests: {
				type: 'boolean',
				default: true
			},
			allowWarningComments: {
				type: 'boolean',
				default: false
			}
		},
		additionalProperties: false
	}
];

module.exports = {
	create,
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Add expiration conditions to TODO comments.',
			url: getDocumentationUrl(__filename)
		},
		messages,
		schema
	}
};
