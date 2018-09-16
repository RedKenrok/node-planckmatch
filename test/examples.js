// Dependency modules.
const test = require(`ava`);
// Custom module.
const planckmatch = require(`../library`);

test(`basic`, function(t) {
	t.true(planckmatch(`path/to/file.css`, `**/*.css`, { globstar: true }));
	t.false(planckmatch(`path/to/file.js`, `**/*.css`, { globstar: true }));
});

test(`multiple_patterns`, function(t) {
	t.deepEqual(planckmatch(`path/to/file.css`, [
		`**/*.css`,
		`**/*.js`
	], { globstar: true }), [ true, false ]);
});

test(`re-use_patterns`, function(t) {
	const expression = planckmatch.parse(`**/*.css`, { globstar: true });
	
	t.true(planckmatch.match(`path/to/file.css`, expression));
	t.false(planckmatch.match(`path/to/file.js`, expression));
});

test(`match_all`, function(t) {
	t.false(!planckmatch(`path/to/file.css`, [
		`path/*.css`,
		`**/to/**/*`
	], { globstar: true }).includes(false));
	
	t.true(!planckmatch(`path/to/file.css`, [
		`**/*.css`,
		`**/to/**/*`
	], { globstar: true }).includes(false));
});

test(`match_any`, function(t) {
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

test(`array.filter`, function(t) {
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