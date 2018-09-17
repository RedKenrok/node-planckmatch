// Modules.
const parse = require(`../library/parse`);
const match = require(`../library/match`);
// Get shared functions.
const { before, beforeEach, afterEach, options } = require(`./_shared`);

// Run before benchmark.
before(`The following benchmark first parses the glob patterns to regular expression using planckmatch(patterns) then loops through each file and calls planckmatch.match(value, expressions) to match the value to the parsed patterns.`);

// High resolution time.
let time;
// Setup default value.
let expressions = null;

beforeEach(`  Using the first pattern parsed once.`);
time = process.hrtime();
for (let i = 0; i < options.iterationCount; i++) {
	expressions = parse(options.pattern);
	for (let j = 0; j < options.filePaths.length; j++) {
		match(options.pattern, expressions);
	}
}
afterEach(process.hrtime(time));

// Reset expressions.
expressions = null;

beforeEach(`  Using all patterns parsed once.`);
time = process.hrtime();
for (let i = 0; i < options.iterationCount; i++) {
	expressions = parse(options.patterns);
	for (let j = 0; j < options.filePaths.length; j++) {
		match(options.pattern, expressions);
	}
}
afterEach(process.hrtime(time));