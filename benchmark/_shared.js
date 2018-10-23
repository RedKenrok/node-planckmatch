// Initialize options.
const options = {
	// Patterns.
	patterns: [
		`*.css`,
		`*.html`,
		`*.js`
	],
	// File paths.
	fileCount: 1e3,
	filePaths: [],
	// Iteration count.
	iterationCount: 1e3
};
// Set default pattern.
options.pattern = options.patterns[1];
// Construct all file paths.
for (let i = 0; i < options.fileCount; i++) {
	options.filePaths.push(`${i}.html`);
}

// Export shared data.
module.exports = {
	before: function(message, patterns = options.patterns) {
		console.log(`\nPlanckmatch benchmark runs a ${options.iterationCount} times on a ${options.fileCount} file paths using the glob patterns: ${patterns.join(`, `)}.`);
		if (message) {
			console.log(message);
		}
	},
	/**
	 * Log message and setup before a test.
	 * @param {String} message Message to display.
	 */
	beforeEach: function(message) {
		console.log(message);
	},
	/**
	 * Log result.
	 * @param {Number} time High resolution time span.
	 */
	afterEach: function(time) {
		console.log(`  -> Done in ${(time[0] * 1e3 + time[1] / 1e6).toFixed(3)}ms.`);
	},
	options: options
};