/**
 * Matches extended glob patterns with a given value.
 * @param {String} value A value to match to.
 * @param {String|Array} patterns An extended glob pattern or array of extended glob patterns.
 * @param {Object} options Glob pattern to regular expression options.
 * @param {Boolean} path Whether it should adapt the pattern to match paths.
 * @returns Boolean or Array of Booleans in pattern order with whether the pattern matched.
 */
const planckmatch = function(value, patterns, options, path) {
	// Parse patterns, match value per pattern, and return results.
	return planckmatch.match(
		value,
		planckmatch.parse(patterns, options, path),
	);
};

planckmatch.parse = require(`./parse`);
planckmatch.match = require(`./match`);

module.exports = planckmatch;