// Node modules.
const assert = require(`assert`);

/**
 * Matches extended glob patterns with a given value.
 * @param {String} value A value to match to.
 * @param {String|Array} patterns An extended glob pattern or array of extended glob patterns.
 * @param {Object} options Glob pattern to regular expression options.
 * @returns Boolean or Array of Booleans in pattern order with whether the pattern matched.
 */
const planckmatch = function(value, patterns, options = {}, isWindows) {
	// Validate arguments.
	assert(typeof(value) === `string`, `planckmatch: value must by of type string.`);
	assert(typeof(patterns) === `string` || (Array.isArray(patterns) && patterns.length > 0 && typeof(patterns[0] === `string`)), `planckmatch: patterns must be of type string or an array of strings.`);
	
	// Parse patterns, match value per pattern, and return results.
	return planckmatch.match(
		value,
		planckmatch.parse(patterns, options),
		isWindows
	);
};

planckmatch.parse = require(`./parse`);
planckmatch.match = require(`./match`);

module.exports = planckmatch;