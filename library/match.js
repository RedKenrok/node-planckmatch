// Node modules.
const assert = require(`assert`);

/**
 * Matches regular expressions with a given value.
 * @param {String} value A value to match to.
 * @param {RegExp|array} expressions A RegExp or array of RegExp used to match with.
 * @returns Boolean or Array of Booleans in pattern order with whether the pattern matched.
 */
const match = function(value, expressions, isWindows = false) {
	// Validate arguments.
	assert(typeof(value) === `string`, `planckmatch.match: value must by of type string.`);
	assert(expressions instanceof RegExp || (Array.isArray(expressions) && expressions.length > 0 && expressions[0] instanceof RegExp), `planckmatch.match: expressions must be of type RegExp or an array of RegExps.`);
	
	// Replace back with front slashes.
	if (isWindows === true) {
		value = value.replace(/\\/g, `/`);
	}
	
	if (Array.isArray(expressions)) {
		// Iterate over expressions.
		const result = [];
		for (let i = 0, length = expressions.length; i < length; i++) {
			result.push(expressions[i].test(value));
		}
		return result;
	}
	
	// Return whether it is a match.
	return expressions.test(value);
};

module.exports = match;