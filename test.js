// Dependency modules.
const test = require(`ava`);
// Custom module.
const planckmatch = require(`.`);

// The tests assume that the dependency `globrex` works correctly.

// Module functions.
// Standard values.
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

// README.md examples.

test(`example basic`, function(t) {
	t.true(planckmatch(`path/to/file.css`, `**/*.css`, { globstar: true }));
	t.false(planckmatch(`path/to/file.js`, `**/*.css`, { globstar: true }));
});

test(`example multiple_patterns`, function(t) {
	t.deepEqual(planckmatch(`path/to/file.css`, [
		`**/*.css`,
		`**/*.js`
	], { globstar: true }), [ true, false ]);
});

test(`example basic`, function(t) {
	const expression = planckmatch.parse(`**/*.css`, { globstar: true });
	
	t.true(planckmatch.match(`path/to/file.css`, expression));
	t.false(planckmatch.match(`path/to/file.js`, expression));
});

test(`example match_all`, function(t) {
	t.false(!planckmatch(`path/to/file.css`, [
		`path/*.css`,
		`**/to/**/*`
	], { globstar: true }).includes(false));
	
	t.true(!planckmatch(`path/to/file.css`, [
		`**/*.css`,
		`**/to/**/*`
	], { globstar: true }).includes(false));
});

test(`example match_any`, function(t) {
	t.false(planckmatch(`path/to/file.css`, [
		`path/*.css`,
		`to/*`
	], { globstar: true }).includes(true));
	
	t.true(planckmatch(`path/to/file.css`, [
		`path/*.css`,
		`**/to/*`
	], { globstar: true }).includes(true));
	
	t.true(planckmatch(`path/to/file.css`, [
		`**/*.css`,
		`**/to/**/*`
	], { globstar: true }).includes(true));
});

test(`example array.filter`, function(t) {
	let expressions = planckmatch.parse([
		`a.*`,
		`*.html`
	]);
	
	t.deepEqual([ `a.css`, `b.html`, `c.js` ].filter(function(value) {
		return !planckmatch.match(value, expressions).includes(false);
	}), []);
	
	t.deepEqual([ `a.css`, `b.html`, `c.js` ].filter(function(value) {
		return planckmatch.match(value, expressions).includes(true);
	}), [ `a.css`, `b.html` ]);
	
	expressions = planckmatch.parse([
		`*`,
		`!(*.css)`
	], { extended: true });
	
	t.deepEqual([ `a.css`, `b.html`, `c.js` ].filter(function(value) {
		return !planckmatch.match(value, expressions).includes(false);
	}), [ `b.html`, `c.js` ]);
});