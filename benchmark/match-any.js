// Modules.
const parse = require(`../library/parse`);
const match = require(`../library/match`);
// Get shared functions.
const { before, beforeEach, afterEach, options } = require(`./_shared`);
const { fileCount, filePaths, iterationCount, pattern } = options;
// Re-order patterns to ensure both match-all and match-any go through two patterns before returning with a result.
const patterns = [
	`*.html`,
	`*.css`,
	`*.js`
];

// Run before benchmark.
before(`The following benchmark first parses the glob patterns to regular expression using planckmatch.parse(patterns) then loops through each file and calls planckmatch.match.any(value, expressions) to match the value to the parsed patterns.`, patterns);

// High resolution time.
let time;
// Setup default value.
let expressions = null;

beforeEach(`  Using the first pattern parsed once.`);
time = process.hrtime();
for (let i = 0; i < iterationCount; i++) {
	expressions = parse(pattern);
	for (let j = 0; j < fileCount; j++) {
		match.any(filePaths[j], expressions);
	}
}
afterEach(process.hrtime(time));

// Reset expressions.
expressions = null;

beforeEach(`  Using all patterns parsed once.`);
time = process.hrtime();
for (let i = 0; i < iterationCount; i++) {
	expressions = parse(patterns);
	for (let j = 0; j < fileCount; j++) {
		match.any(filePaths[j], expressions);
	}
}
afterEach(process.hrtime(time));