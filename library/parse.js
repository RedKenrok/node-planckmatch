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
 * Parses extended glob patterns into regular expressions.
 * @param {String|array} patterns An extended glob pattern or array of extended glob patterns.
 * @param {Object} options Glob pattern to regular expression options.
 */
const parse = function(patterns, options = {}) {
	// Validate arguments.
	assert(typeof(patterns) === `string` || (Array.isArray(patterns) && patterns.length > 0 && typeof(patterns[0] === `string`)), `planckmatch.parse: patterns must be of type string or an array of strings.`);
	validateOptions(options);
	options.filepath = false;
	
	if (Array.isArray(patterns)) {
		// Iterate over patterns.
		return patterns.map(function(pattern) {
			return globrex(pattern, options).regex;
		});
	}
	
	// Return as expression.
	return globrex(patterns, options).regex;
};

module.exports = parse;