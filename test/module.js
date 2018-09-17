// Dependency modules.
const test = require(`ava`);
// Custom module.
const planckmatch = require(`../library`),
	parse = require(`../library/parse`),
	match = require(`../library/match`);

const filePathCss = `path/to/file.css`,
	filePathJs = `path/to/file.js`;
const patternStar = `**/*.css`,
	patternFile = `**/file.css`;
const expressionStar = /^((?:[^/]*(?:\/|$))*)([^/]*)\.css$/,
	expressionFile = /^((?:[^/]*(?:\/|$))*)file\.css$/;

test(`index`, function(t) {
	// Module properties and types.
	t.is(typeof(planckmatch), `function`);
	t.is(planckmatch.parse, parse);
	t.is(typeof(planckmatch.parse), `function`);
	t.is(planckmatch.match, match);
	t.is(typeof(planckmatch.match), `function`);
	
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

test(`parse`, function(t) {
	// Type.
	t.is(typeof(parse), `function`);
	
	// Patterns as a string.
	t.deepEqual(parse(patternStar, { globstar: true }), expressionStar);
	
	// Patterns as an array.
	t.deepEqual(parse([
		patternStar,
		patternFile
	], { globstar: true }), [
		expressionStar,
		expressionFile
	]);
});

test(`match`, function(t) {
	// Type.
	t.is(typeof(match), `function`);
	
	// Expressions as a string.
	t.true(match(filePathCss, expressionStar));
	t.false(match(filePathJs, expressionStar));
	
	// Expressions as an array.
	t.deepEqual(match(filePathCss, [
		expressionStar,
		expressionFile
	]), [ true, true ]);
	t.deepEqual(match(filePathJs, [
		expressionStar,
		expressionFile
	]), [ false, false ]);
});