/**
 * Matches regular expressions with a given value.
 * @param {String} value A value to match to.
 * @param {RegExp|array} expressions A RegExp or array of RegExp used to match with.
 * @returns Boolean or Array of Booleans in pattern order with whether the pattern matched.
 */
const match = function (value, expressions) {
  if (!Array.isArray(expressions)) {
    // Return whether it is a match.
    return expressions.test(value)
  }

  // Iterate over expressions.
  const result = []
  for (let i = 0, length = expressions.length; i < length; i++) {
    result.push(expressions[i].test(value))
  }
  return result
}

/**
 * Optimized function for matching regular expressions to a given value.
 * @param {String} value A value to match to.
 * @param {RegExp|array} expressions A RegExp or array of RegExp used to match with.
 * @param {Boolean} compare A value to compare the match result to.
 * @returns As soon as the test result is equal to the given result then returns early returning the result value, otherwise it returns the inverse of the given result.
 */
const immediate = function (value, expressions, compare) {
  if (!Array.isArray(expressions)) {
    // Return whether it is a match.
    return expressions.test(value)
  }

  // Iterate over expressions.
  for (let i = 0, length = expressions.length; i < length; i++) {
    // As soon as a test is equal to result return early.
    if (expressions[i].test(value) === compare) {
      return compare
    }
  }
  // If not match equal.
  return !compare
}

/**
 * Matches regular expressions with a given value, returns true if all expressions matched.
 * @param {String} value A value to match to.
 * @param {RegExp|array} expressions A RegExp or array of RegExp used to match with.
 * @returns Whether all patterns matched.
 */
match.all = function (value, expressions) {
  return immediate(value, expressions, false)
}

/**
 * Matches regular expressions with a given value, returns true if any expressions matched.
 * @param {String} value A value to match to.
 * @param {RegExp|array} expressions A RegExp or array of RegExp used to match with.
 * @returns Whether any patterns matched.
 */
match.any = function (value, expressions) {
  return immediate(value, expressions, true)
}

module.exports = match
