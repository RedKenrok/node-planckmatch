// Dependency modules.
const test = require(`ava`);
// Custom module.
const planckmatch = require(`../library`);

const filePathCss = `path/to/file.css`,
	filePathJs = `path/to/file.js`;
const patternStar = `**/*.css`,
	patternFile = `**/file.css`;
const expressionStar = /^((?:[^/]*(?:\/|$))*)([^/]*)\.css$/,
	expressionFile = /^((?:[^/]*(?:\/|$))*)file\.css$/;

test(`planckmatch`, function(t) {
	// Patterns as a string.
	t.true(planckmatch(filePathCss, patternStar, { globstar: true }));
	t.false(planckmatch(filePathJs, patternStar, { globstar: true }));
	
	// Patterns as an array.
	t.deepEqual(planckmatch(filePathCss, [
		patternStar,
		patternFile
	], { globstar: true }), [ true, true ]);
	t.deepEqual(planckmatch(filePathJs, [
		patternStar,
		patternFile
	], { globstar: true }), [ false, false ]);
});

test(`planckmatch.parse`, function(t) {
	// Patterns as a string.
	t.deepEqual(planckmatch.parse(patternStar, { globstar: true }), expressionStar);
	
	// Patterns as an array.
	t.deepEqual(planckmatch.parse([
		patternStar,
		patternFile
	], { globstar: true }), [
		expressionStar,
		expressionFile
	]);
});

test(`planckmatch.match`, function(t) {
	// Expressions as a string.
	t.true(planckmatch.match(filePathCss, expressionStar));
	t.false(planckmatch.match(filePathJs, expressionStar));
	
	// Expressions as an array.
	t.deepEqual(planckmatch.match(filePathCss, [
		expressionStar,
		expressionFile
	]), [ true, true ]);
	t.deepEqual(planckmatch.match(filePathJs, [
		expressionStar,
		expressionFile
	]), [ false, false ]);
});