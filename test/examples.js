// Dependency modules.
const test = require(`ava`);
// Custom module.
const planckmatch = require(`../library`);

test(`basic`, function(t) {
	t.true(planckmatch(`path/to/file.css`, `*.css`));
	t.false(planckmatch(`path/to/file.js`, `*.css`));
});

test(`multiple patterns`, function(t) {
	t.deepEqual(planckmatch(`path/to/file.css`, [
		`*.css`,
		`*.js`
	]), [ true, false ]);
});

test(`re-use patterns`, function(t) {
	const expression = planckmatch.parse(`*.css`);
	
	t.true(planckmatch.match(`path/to/file.css`, expression));
	t.false(planckmatch.match(`path/to/file.js`, expression));
});

test(`match all`, function(t) {
	t.false(planckmatch.all(`path/to/file.css`, [ `*.html`, `*/to/*` ]));
	t.true(planckmatch.all(`path/to/file.css`, [ `*.css`, `*/to/*` ]));
});

test(`match any`, function(t) {
	t.false(planckmatch.any(`path/to/file.css`, [ `*.html`, `to/*` ]));
	t.true(planckmatch.any(`path/to/file.css`, [ `*.css`, `to/*` ]));
	t.true(planckmatch.any(`path/to/file.css`, [ `*.css`, `*/to/*` ]));
});

test(`filter array`, function(t) {
	let expressions = planckmatch.parse([
		`a.*`,
		`*.html`
	]);
	
	t.deepEqual([ `a.css`, `b.html`, `c.js` ].filter(function(value) {
		return planckmatch.match.all(value, expressions);
	}), []);
	
	t.deepEqual([ `a.css`, `b.html`, `c.js` ].filter(function(value) {
		return planckmatch.match.any(value, expressions);
	}), [ `a.css`, `b.html` ]);
	
	expressions = planckmatch.parse([
		`*`,
		`!(*.css)`
	], { extended: true });
	
	t.deepEqual([ `a.css`, `b.html`, `c.js` ].filter(function(value) {
		return planckmatch.match.all(value, expressions);
	}), [ `b.html`, `c.js` ]);
});