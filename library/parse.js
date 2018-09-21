// Node modules.
const assert = require(`assert`);
// Regular expression segments.
const GLOBSTAR = `((?:[^/]*(?:/|$))*)`;
const WILDCARD = `([^/]*)`;

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
	if (options.flags) {
		assert(typeof(options.flags) === `string`, `planckmatch: options.flags must be of type string.`);
	}
	if (options.globstar) {
		assert(typeof(options.globstar) === `boolean`, `planckmatch: options.globstar must be of type boolean.`);
	}
	if (options.strict) {
		assert(typeof(options.strict) === `boolean`, `planckmatch: options.strict must be of type boolean.`);
	}
};

/**
 * Converts glob pattern into a regular expression.
 * @param {String} pattern Glob pattern.
 * @param {Object} options Conversion options.
 * @param {Boolean} options.extended Whether to use extended glob patterns.
 * @param {String} options.flags Any regular expressions flags.
 * @param {Boolean} options.globstar Whether to accept multiple glob stars.
 * @param {Boolean} options.strict Whether to be strict on forwards slashes.
 * @returns {RegExp} Pattern as regular expressions.
 */
const toRegExp = function(pattern, { extended = false, flags = ``, globstar = false, strict = false } = {}) {
	// Empty expression to concatenate onto.
	let expression = ``;
	
	// Track scope.
	const stack = [];
	let inGroup = false,
		inRange = false;
	
	// Current and next character.
	let c,
		n;
	for (let i = 0; i < pattern.length; i++) {
		// Get current character.
		c = pattern[i];
		// Get next character.
		n = pattern[i + 1];
		
		switch(c) {
			case `\\`:
			case `$`:
			case `^`:
			case `.`:
			case `=`:
				expression += `\\${c}`;
				continue;
			
			case `|`:
			case `(`:
				if (stack.length) {
					expression += c;
					continue;
				}
				expression += `\\${c}`;
				continue;
			
			case `)`:
				if (stack.length) {
					expression += c;
					const type = stack.pop();
					if (type === `@`) {
						expression += `{1}`;
					} else if (type === `!`) {
						expression += WILDCARD;
					} else {
						expression += type;
					}
					continue;
				}
				expression += `\\${c}`;
				continue;
			
			case `{`:
				if (extended) {
					inGroup = true;
					expression += `(`;
					continue;
				}
				expression += `\\${c}`;
				continue;
			
			case `}`:
				if (extended) {
					inGroup = false;
					expression += `)`;
					continue;
				}
				expression += `\\${c}`;
				continue;
			
			case `,`:
				if (inGroup) {
					expression += `|`;
					continue;
				}
				expression += `\\${c}`;
				continue;
			
			case `/`:
				expression += `\\${c}`;
				if (n === `/` && !strict) {
					expression += `?`;
				}
				continue;
			
			case `+`:
				if (n === `(` && extended) {
					stack.push(c);
					continue;
				}
				expression += `\\${c}`;
				continue;
			
			case `?`:
				if (extended) {
					if (n === `(`) {
						stack.push(c);
					} else {
						expression += `.`;
					}
					continue;
				}
				expression += `\\${c}`;
				continue;
			
			case `!`:
				if (extended) {
					if (inRange) {
						expression += `^`;
						continue;
					}
					if (n === `(`) {
						stack.push(c);
						expression += `(?!`;
						i++;
						continue;
					}
				}
				expression += `\\${c}`;
				continue;
			
			case `[`:
				if (inRange && n === `:`) {
					i++;
					let value = ``;
					while(pattern[++i] !== `:`) {
						value += pattern[i];
					}
					if (value === `alnum`) {
						expression += `(\\w|\\d)`;
					} else if (value === `space`) {
						expression += `(\\s)`;
					} else if (value === `digit`) {
						expression += `(\\d)`;
					}
					i++;
					continue;
				}
				if (extended) {
					inRange = true;
					expression += c;
					continue;
				}
				expression += `\\${c}`;
				continue;
			
			case `]`:
				if (extended) {
					inRange = false;
					expression += c;
					continue;
				}
				expression += `\\${c}`;
				continue;
			
			case `*`:
				if (n === `(` && extended) {
					stack.push(c);
					continue;
				}
				
				// Count and skip all asterisks'.
				const p = pattern[i - 1];
				let starCount = 1;
				while(pattern[i + 1] === `*`) {
					starCount++;
					i++;
				}
				n = pattern[i + 1];
				
				if (!globstar) {
					// Count as a single asterisks.
					expression += `.*`;
				} else if (starCount > 1 && (p === undefined || p === `/`) && (n === undefined || n === `/`)) {
					expression += GLOBSTAR;
					// Skip the next forwards slash.
					i++;
				} else {
					expression += WILDCARD;
				}
				continue;
		}
		
		if (c === `@` && extended) {
			if (n === `(`) {
				stack.push(c);
				continue;
			}
		}
		
		expression += c;
	}
	
	if (!flags.includes(`g`)) {
		expression = `^${expression}$`;
	}
	
	return new RegExp(expression, flags);
};

/**
 * Parses extended glob patterns into regular expressions.
 * @param {String|Array} patterns An extended glob pattern or array of extended glob patterns.
 * @param {Object} options Glob pattern to regular expression options.
 * @returns {RegExp|Array} Patterns as regular expressions.
 */
const parse = function(patterns, options) {
	// Validate arguments.
	assert(typeof(patterns) === `string` || (Array.isArray(patterns) && patterns.length > 0 && typeof(patterns[0] === `string`)), `planckmatch.parse: patterns must be of type string or an array of strings.`);
	validateOptions(options);
	
	// Check if array.
	if (Array.isArray(patterns)) {
		// Iterate over patterns.
		const result = [];
		for (let i = 0, length = patterns.length; i < length; i++) {
			result.push(toRegExp(patterns[i], options));
		}
		return result;
	}
	
	// Return as expression.
	return toRegExp(patterns, options);
};

module.exports = parse;