// Dependency modules.
const test = require(`ava`);
// Custom module.
const planckmatch = require(`../library`),
	parse = require(`../parse`),
	match = require(`../match`);

// Options.
const GLOBSTAR_FALSE = { globstar: false },
	GLOBSTAR_TRUE = { globstar: true };
// File paths.
const FILE_PATH_CSS = `path/to/file.css`,
	FILE_PATH_CSS_WINDOWS = `path\\to\\file.css`;
const FILE_PATH_HTML = `path/file.html`;
// Glob patterns.
const PATTERN_FILE = `path/to/*.css`,
	PATTERN_SINGLE = `path/*`,
	PATTERN_DOUBLE = `path/**`;
// Regular expressions.
const EXPRESSION_FILE = /^path\/to\/.*\.css$/,
	EXPRESSION_FILE_GLOBSTAR = /^path\/to\/([^/]*)\.css$/;
const EXPRESSION_SINGLE = /^path\/.*$/,
	EXPRESSION_SINGLE_GLOBSTAR = /^path\/([^/]*)$/;
const EXPRESSION_DOUBLE = /^path\/.*$/,
	EXPRESSION_DOUBLE_GLOBSTAR = /^path\/((?:[^/]*(?:\/|$))*)$/;
const EXPRESSION_DOUBLE_WINDOWS = /^path\\((?:[^\\]*(?:\\|$))*)$/;

test(`index`, function(t) {
	// Module properties and types.
	t.is(typeof(planckmatch), `function`);
	t.is(planckmatch.parse, parse);
	t.is(typeof(planckmatch.parse), `function`);
	t.is(planckmatch.match, match);
	t.is(typeof(planckmatch.match), `function`);
	
	// Pattern as string.
	t.true(planckmatch(FILE_PATH_CSS, PATTERN_FILE));
	t.false(planckmatch(FILE_PATH_HTML, PATTERN_FILE));
	
	// Patterns as an array.
	t.deepEqual(planckmatch(FILE_PATH_CSS, [
		PATTERN_FILE,
		PATTERN_SINGLE
	]), [ true, true ]);
	t.deepEqual(planckmatch(FILE_PATH_HTML, [
		PATTERN_FILE,
		PATTERN_SINGLE
	]), [ false, true ]);
	
	// Options.
	t.true(planckmatch(FILE_PATH_CSS, PATTERN_SINGLE));
	t.true(planckmatch(FILE_PATH_HTML, PATTERN_SINGLE));
	
	t.true(planckmatch(FILE_PATH_CSS, PATTERN_SINGLE, GLOBSTAR_FALSE));
	t.true(planckmatch(FILE_PATH_HTML, PATTERN_SINGLE, GLOBSTAR_FALSE));
	
	t.false(planckmatch(FILE_PATH_CSS, PATTERN_SINGLE, GLOBSTAR_TRUE));
	t.true(planckmatch(FILE_PATH_HTML, PATTERN_SINGLE, GLOBSTAR_TRUE));
	
	t.true(planckmatch(FILE_PATH_CSS, PATTERN_DOUBLE));
	t.true(planckmatch(FILE_PATH_HTML, PATTERN_DOUBLE));
	
	t.true(planckmatch(FILE_PATH_CSS, PATTERN_DOUBLE, GLOBSTAR_FALSE));
	t.true(planckmatch(FILE_PATH_HTML, PATTERN_DOUBLE, GLOBSTAR_FALSE));
	
	t.true(planckmatch(FILE_PATH_CSS, PATTERN_DOUBLE, GLOBSTAR_TRUE));
	t.true(planckmatch(FILE_PATH_HTML, PATTERN_DOUBLE, GLOBSTAR_TRUE));
	
	// Unix and windows paths.
	t.true(planckmatch(FILE_PATH_CSS, PATTERN_DOUBLE, GLOBSTAR_TRUE, false));
	if (process.platform === `win32`) {
		t.false(planckmatch(FILE_PATH_CSS, PATTERN_DOUBLE, GLOBSTAR_TRUE, true));
	} else {
		t.true(planckmatch(FILE_PATH_CSS, PATTERN_DOUBLE, GLOBSTAR_TRUE, true));
	}
	
	t.false(planckmatch(FILE_PATH_CSS_WINDOWS, PATTERN_DOUBLE, GLOBSTAR_TRUE, false));
	if (process.platform === `win32`) {
		t.true(planckmatch(FILE_PATH_CSS_WINDOWS, PATTERN_DOUBLE, GLOBSTAR_TRUE, true));
	} else {
		t.false(planckmatch(FILE_PATH_CSS_WINDOWS, PATTERN_DOUBLE, GLOBSTAR_TRUE, true));
	}
});

test(`parse`, function(t) {
	// Type.
	t.is(typeof(parse), `function`);
	
	// Patterns as a string.
	t.deepEqual(parse(PATTERN_FILE), EXPRESSION_FILE);
	t.deepEqual(parse(PATTERN_FILE, GLOBSTAR_FALSE), EXPRESSION_FILE);
	t.deepEqual(parse(PATTERN_FILE, GLOBSTAR_TRUE), EXPRESSION_FILE_GLOBSTAR);
	
	t.deepEqual(parse(PATTERN_SINGLE), EXPRESSION_SINGLE);
	t.deepEqual(parse(PATTERN_SINGLE, GLOBSTAR_FALSE), EXPRESSION_SINGLE);
	t.deepEqual(parse(PATTERN_SINGLE, GLOBSTAR_TRUE), EXPRESSION_SINGLE_GLOBSTAR);
	
	t.deepEqual(parse(PATTERN_DOUBLE), EXPRESSION_DOUBLE);
	t.deepEqual(parse(PATTERN_DOUBLE, GLOBSTAR_FALSE), EXPRESSION_DOUBLE);
	t.deepEqual(parse(PATTERN_DOUBLE, GLOBSTAR_TRUE), EXPRESSION_DOUBLE_GLOBSTAR);
	
	// Patterns as an array.
	t.deepEqual(parse([
		PATTERN_FILE,
		PATTERN_SINGLE,
		PATTERN_DOUBLE
	], GLOBSTAR_FALSE), [
		EXPRESSION_FILE,
		EXPRESSION_SINGLE,
		EXPRESSION_DOUBLE
	]);
	t.deepEqual(parse([
		PATTERN_FILE,
		PATTERN_SINGLE,
		PATTERN_DOUBLE
	], GLOBSTAR_TRUE), [
		EXPRESSION_FILE_GLOBSTAR,
		EXPRESSION_SINGLE_GLOBSTAR,
		EXPRESSION_DOUBLE_GLOBSTAR
	]);
	
	// Unix and windows paths.
	t.deepEqual(parse(PATTERN_DOUBLE, GLOBSTAR_TRUE), EXPRESSION_DOUBLE_GLOBSTAR);
	t.notDeepEqual(parse(PATTERN_DOUBLE, GLOBSTAR_TRUE), EXPRESSION_DOUBLE_WINDOWS);
	
	t.deepEqual(parse(PATTERN_DOUBLE, GLOBSTAR_TRUE, false), EXPRESSION_DOUBLE_GLOBSTAR);
	t.notDeepEqual(parse(PATTERN_DOUBLE, GLOBSTAR_TRUE, false), EXPRESSION_DOUBLE_WINDOWS);
	
	t.notDeepEqual(parse(PATTERN_DOUBLE, GLOBSTAR_TRUE, true), EXPRESSION_DOUBLE_GLOBSTAR);
	if (process.platform === `win32`) {
		t.deepEqual(parse(PATTERN_DOUBLE, GLOBSTAR_TRUE, true), EXPRESSION_DOUBLE_WINDOWS);
	} else {
		t.notDeepEqual(parse(PATTERN_DOUBLE, GLOBSTAR_TRUE, true), EXPRESSION_DOUBLE_WINDOWS);
	}
});

test(`match`, function(t) {
	// Type.
	t.is(typeof(match), `function`);
	
	// Expressions as RegExp.
	t.true(match(FILE_PATH_CSS, EXPRESSION_FILE));
	t.true(match(FILE_PATH_CSS, EXPRESSION_FILE_GLOBSTAR));
	t.true(match(FILE_PATH_CSS, EXPRESSION_SINGLE));
	t.false(match(FILE_PATH_CSS, EXPRESSION_SINGLE_GLOBSTAR));
	t.true(match(FILE_PATH_CSS, EXPRESSION_DOUBLE));
	t.true(match(FILE_PATH_CSS, EXPRESSION_DOUBLE_GLOBSTAR));
	
	t.false(match(FILE_PATH_HTML, EXPRESSION_FILE));
	t.false(match(FILE_PATH_HTML, EXPRESSION_FILE_GLOBSTAR));
	t.true(match(FILE_PATH_HTML, EXPRESSION_SINGLE));
	t.true(match(FILE_PATH_HTML, EXPRESSION_SINGLE_GLOBSTAR));
	t.true(match(FILE_PATH_HTML, EXPRESSION_DOUBLE));
	t.true(match(FILE_PATH_HTML, EXPRESSION_DOUBLE_GLOBSTAR));
	
	// Expressions as an array.
	t.deepEqual(match(FILE_PATH_CSS, [
		EXPRESSION_FILE,
		EXPRESSION_SINGLE_GLOBSTAR
	]), [ true, false ]);
	t.deepEqual(match(FILE_PATH_HTML, [
		EXPRESSION_FILE,
		EXPRESSION_SINGLE_GLOBSTAR
	]), [ false, true ]);
	
	// Unix and windows paths.
	t.true(match(FILE_PATH_CSS, EXPRESSION_DOUBLE));
	t.false(match(FILE_PATH_CSS, EXPRESSION_DOUBLE_WINDOWS));
	
	t.false(match(FILE_PATH_CSS_WINDOWS, EXPRESSION_DOUBLE));
	t.true(match(FILE_PATH_CSS_WINDOWS, EXPRESSION_DOUBLE_WINDOWS));
});