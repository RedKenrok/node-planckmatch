// Node modules.
const assert = require(`assert`);

/**
 * Matches regular expressions with a given value.
 * @param {String} value A value to match to.
 * @param {RegExp|array} expressions A RegExp or array of RegExp used to match with.
 */
const match = function(value, expressions) {
	// Validate arguments.
	assert(typeof(value) === `string`, `planckmatch.match: value must by of type string.`);
	assert(expressions instanceof RegExp || (Array.isArray(expressions) && expressions.length > 0 && expressions[0] instanceof RegExp), `planckmatch.match: expressions must be of type RegExp or an array of RegExps.`);
	
	if (Array.isArray(expressions)) {
		// Iterate over expressions.
		return expressions.map(function(expression) {
			return !!value.match(expression);
		});
	}
	
	// Return whether it is a match.
	return !!value.match(expressions);
};

module.exports = match;