// Modules.
const planckmatch = require(`../library`);
// Get shared functions.
const { before, beforeEach, afterEach, options } = require(`./_shared`);

// Run before benchmark.
before(`The following benchmark only uses the planckmatch(value, patterns) function which is only recommended when using that set of patterns once.`);

// High resolution time.
let time;

beforeEach(`  Using the first pattern.`);
time = process.hrtime();
for (let i = 0; i < options.iterationCount; i++) {
	for (let j = 0; j < options.filePaths.length; j++) {
		planckmatch(options.filePaths[j], options.pattern);
	}
}
afterEach(process.hrtime(time));

beforeEach(`  Using all patterns.`);
time = process.hrtime();
for (let i = 0; i < options.iterationCount; i++) {
	for (let j = 0; j < options.filePaths.length; j++) {
		planckmatch(options.filePaths[j], options.patterns);
	}
}
afterEach(process.hrtime(time));