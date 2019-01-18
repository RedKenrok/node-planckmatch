/**
 * Matches extended glob patterns with a given value.
 * @param {String} value A value to match to.
 * @param {String|Array} patterns An extended glob pattern or array of extended glob patterns.
 * @param {Object} options Glob pattern to regular expression options.
 * @param {Boolean} isPath Whether it should adapt the pattern to match paths.
 * @returns Boolean or Array of Booleans in pattern order with whether the pattern matched.
 */
const planckmatch = function(value, patterns, options, isPath) {
	// Parse patterns, match value per pattern, and return results.
	return planckmatch.match(value, planckmatch.parse(patterns, options, isPath));
};

/**
 * Matches extended glob patterns with a given value, returns true if all expressions matched.
 * @param {String} value A value to match to.
 * @param {String|Array} patterns An extended glob pattern or array of extended glob patterns.
 * @param {Object} options Glob pattern to regular expression options.
 * @param {Boolean} isPath Whether it should adapt the pattern to match paths.
 * @returns Whether all patterns matched.
 */
planckmatch.all = function(value, patterns, options, isPath) {
	// Parse patterns, match value per pattern, and return results.
	return planckmatch.match.all(value, planckmatch.parse(patterns, options, isPath));
};

/**
 * Matches extended glob patterns with a given value, returns true if any expressions matched.
 * @param {String} value A value to match to.
 * @param {String|Array} patterns An extended glob pattern or array of extended glob patterns.
 * @param {Object} options Glob pattern to regular expression options.
 * @param {Boolean} isPath Whether it should adapt the pattern to match paths.
 * @returns Whether any patterns matched.
 */
planckmatch.any = function(value, patterns, options, isPath) {
	// Parse patterns, match value per pattern, and return results.
	return planckmatch.match.any(value, planckmatch.parse(patterns, options, isPath));
};

planckmatch.parse = require(`./parse`);
planckmatch.match = require(`./match`);

module.exports = planckmatch;