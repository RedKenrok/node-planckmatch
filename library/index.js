// Node modules.
const assert = require(`assert`);
// Dependency modules.
const globrex = require(`globrex`);

/**
 * Validate the given options types.
 * @param {Object} options Glob pattern to regular expression options.
 */
const validateOptions = function(options) {
	if (!options) {
		return;
	}
	assert(typeof(options) === `object`, `planckmatch: options must be of type object.`);
	
	if (options.extended) {
		assert(typeof(options.extended) === `boolean`, `planckmatch: options.extended must be of type boolean.`);
	}
	if (options.globstar) {
		assert(typeof(options.globstar) === `boolean`, `planckmatch: options.globstar must be of type boolean.`);
	}
	if (options.strict) {
		assert(typeof(options.strict) === `boolean`, `planckmatch: options.strict must be of type boolean.`);
	}
	
	if (options.flags) {
		assert(typeof(options.flags) === `string`, `planckmatch: options.flags must be of type string.`);
	}
};

/**
 * Matches extended glob patterns with a given value.
 * @param {String} value A value to match to.
 * @param {String|array} patterns An extended glob pattern or array of extended glob patterns.
 * @param {Object} options Glob pattern to regular expression options.
 */
const planckmatch = function(value, patterns, options = {}) {
	// Validate arguments.
	assert(typeof(value) === `string`, `planckmatch: value must by of type string.`);
	assert(typeof(patterns) === `string` || (Array.isArray(patterns) && patterns.length > 0 && typeof(patterns[0] === `string`)), `planckmatch: patterns must be of type string or an array of strings.`);
	validateOptions(options);
	options.filepath = false;
	
	// Parse patterns, match value per pattern, and return results.
	return planckmatch.match(
		value,
		planckmatch.parse(patterns, options)
	);
};

/**
 * Parses extended glob patterns into regular expressions.
 * @param {String|array} patterns An extended glob pattern or array of extended glob patterns.
 * @param {Object} options Glob pattern to regular expression options.
 */
planckmatch.parse = function(patterns, options = {}) {
	// Validate arguments.
	assert(typeof(patterns) === `string` || (Array.isArray(patterns) && patterns.length > 0 && typeof(patterns[0] === `string`)), `planckmatch.parse: patterns must be of type string or an array of strings.`);
	validateOptions(options);
	options.filepath = false;
	
	if (Array.isArray(patterns)) {
		// Iterate over patterns.
		return patterns.map(function(pattern) {
			return planckmatch.parse(pattern, options);
		});
	}
	
	// Return as expression.
	return globrex(patterns, options).regex;
};

/**
 * Matches regular expressions with a given value.
 * @param {String} value A value to match to.
 * @param {RegExp|array} expressions A RegExp or array of RegExp used to match with.
 */
planckmatch.match = function(value, expressions) {
	// Validate arguments.
	assert(typeof(value) === `string`, `planckmatch: value must by of type string.`);
	assert(expressions instanceof RegExp || (Array.isArray(expressions) && expressions.length > 0 && expressions[0] instanceof RegExp), `planckmatch.match: expressions must be of type RegExp or an array of RegExps.`);
	
	if (Array.isArray(expressions)) {
		// Iterate over expressions.
		return expressions.map(function(expression) {
			return planckmatch.match(value, expression);
		});
	}
	
	// Return whether it is a match.
	return !!value.match(expressions);
};

module.exports = planckmatch;