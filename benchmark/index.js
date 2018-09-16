// Modules.
const planckmatch = require(`../library`);

/**
 * Log result.
 * @param {*} time High resolution time span.
 */
const logResult = function(time) {
	console.log(`  -> Done in ${(time[0] * 1e3 + time[1] / 1e6).toFixed(3)}ms.`);
};

// Patterns.
const patterns = [
	`**/*.css`,
	`**/*.html`,
	`**/*.js`
];
const pattern = patterns[0];
// File paths.
const fileCount = 1e3;
const filePaths = [];
for (let i = 0; i < fileCount; i++) {
	filePaths.push(`${i}.css`);
}
// Iteration count.
const iterationCount = 1e3;

// Provide benchmark context.
console.log(`Planckmatch benchmark runs a ${iterationCount} times on a ${fileCount} files using the glob patterns: ${patterns.join(`, `)}.`);

// High resolution time.
let time;

// Next benchmark.
console.log(`  Using the first pattern.`);
time = process.hrtime();
for (let i = 0; i < iterationCount; i++) {
	for (let j = 0; j < filePaths.length; j++) {
		planckmatch(filePaths[j], pattern);
	}
}
logResult(process.hrtime(time));

// Next benchmark.
console.log(`  Using all patterns.`);
time = process.hrtime();
for (let i = 0; i < iterationCount; i++) {
	for (let j = 0; j < filePaths.length; j++) {
		planckmatch(filePaths[j], patterns);
	}
}
logResult(process.hrtime(time));

// Next benchmark.
console.log(`  Using the first pattern parsed once.`);
time = process.hrtime();
const expression = planckmatch.parse(pattern);
for (let i = 0; i < iterationCount; i++) {
	for (let j = 0; j < filePaths.length; j++) {
		planckmatch.match(pattern, expression);
	}
}
logResult(process.hrtime(time));

// Next benchmark.
console.log(`  Using all patterns parsed once.`);
time = process.hrtime();
const expressions = planckmatch.parse(patterns);
for (let i = 0; i < iterationCount; i++) {
	for (let j = 0; j < filePaths.length; j++) {
		planckmatch.match(pattern, expressions);
	}
}
logResult(process.hrtime(time));