[![Version npm package](https://img.shields.io/npm/v/planckmatch.svg?label=npm&style=flat-square)](https://npmjs.com/package/planckmatch)
[![Version master branch](https://img.shields.io/github/package-json/v/redkenrok/node-planckmatch.svg?label=master&style=flat-square)](https://github.com/redkenrok/node-planckmatch#readme)
[![License agreement](https://img.shields.io/github/license/redkenrok/node-planckmatch.svg?style=flat-square)](https://github.com/redkenrok/node-planckmatch/blob/master/LICENSE)
[![Travis-ci build status](https://img.shields.io/travis-ci/RedKenrok/node-planckmatch.svg?label=travis&branch=master&style=flat-square)](https://travis-ci.org/redkenrok/node-planckmatch)
[![Open issues on GitHub](https://img.shields.io/github/issues/redkenrok/node-planckmatch.svg?style=flat-square)](https://github.com/redkenrok/node-planckmatch/issues)

# Planckmatch

Small and simple matching library using glob patterns.

## Install

```
$ npm install planckmatch
```

## Functions

**planckmatch(value, patterns, options)**

Matches extended glob patterns with a given value.

Returns: `Boolean` or `Array of Booleans`

* `value`: A value to match to.
  * Type: `String` or `Array of strings`
  * Required: `true`
* `patterns`: An extended glob pattern or array of extended glob patterns.
  * Type: `String` or `Array of strings`
  * Required: `true`
* `options`: [Options](#options) for conversion of glob pattern to regular expression.
  * Type: `Object`
  * Default: `{}`

**planckmatch.parse(patterns, options)**

Parses extended glob patterns into regular expressions.

Returns: `RegExp` or `Array of RegExps`

* `patterns`: An extended glob pattern or array of extended glob patterns.
  * Type: `String` or `Array of strings`
  * Required: `true`
* `options`: [Options](#options) for conversion of glob pattern to regular expression.
  * Type: `Object`
  * Default: `{}`

**planckmatch.match(value, expressions)**

Matches regular expressions with a given value.

Returns: `Boolean` or `Array of Booleans`

* `value`: A value to match to.
  * Type: `String` or `Array of strings`
  * Required: `true`
* `expressions`: A RegExp or array of RegExp used to match with.
  * Type: `RegExp` or `Array of RegExps`
  * Required: `true`

## Options

Options for conversion of glob pattern to regular expression.

* `options.extended`: Enable all advanced features from `extglob`.
  * Type: `Boolean`
  * Default: `false`
* `options.globstar`: If `false` globs like `'/foo/*'` will match any string beginning with `'/foo/'`. If `true` the same `'/foo/*'` will match any string beginning with `'/foo/'` that does not have a `'/'` to the right of it, for example it will match: `'/foo/bar.txt'` but not `'/foo/bar/baz.txt'`.
  * Type: `Boolean`
  * Default: `false`
* `options.strict`: Be forgiving about multiple slashes, like /// and make everything after the first / optional. This is how bash glob works.
  * Type: `Boolean`
  * Default: `false`
* `options.flags`: RegExp flags (e.g. `'i'` ) to pass to the RegExp constructor.
  * Type: `String`
  * Default: `''`

## Usage

The most basic example using a single path and pattern.

```JavaScript
const planckmatch = require(`planckmatch`);

planckmatch(`path/to/file.css`, `**/*.css`, { globstar: true }); // true
planckmatch(`path/to/file.css`, `**/*.js`, { globstar: true }); // false
```

**Multiple patterns**

The pattern can also be an array, therefor the returned results will also be an array of equal length.

```JavaScript
const planckmatch = require(`planckmatch`);

planckmatch(`path/to/file.css`, [
  `**/*.css`,
  `**/*.js`
], { globstar: true }); // [ true, false ]
```

**Re-use patterns**

If you re-use patterns I highly recommend parsing the patterns and matching the values direct instead of using the all-in-one function for it, as it parses the patterns each time.

```JavaScript
const planckmatch = require(`planckmatch`);

const expression = planckmatch.parse(`**/*.css`, { globstar: true });

planckmatch.match(`path/to/file.css`, expression); // true
planckmatch.match(`path/to/file.js`, expression); // false
```

**Match all**

Check if all patterns match.

```JavaScript
const planckmatch = require(`planckmatch`);

!planckmatch(`path/to/file.css`, [
  `path/*.css`,
  `**/to/**/*`
], { globstar: true }).includes(false); // false, since `path/*.css` does not match.

!planckmatch(`path/to/file.css`, [
  `**/*.css`,
  `**/to/**/*`
], { globstar: true }).includes(false); // true, since all patterns match.
```

**Match any**

Check if any pattern matches.

```JavaScript
const planckmatch = require(`planckmatch`);

planckmatch(`path/to/file.css`, [
  `path/*.css`,
  `to/*`
], { globstar: true }).includes(true); // false, since no pattern matches.

planckmatch(`path/to/file.css`, [
  `path/*.css`,
  `**/to/*`
], { globstar: true }).includes(true); // true, since the second pattern matches.

planckmatch(`path/to/file.css`, [
  `**/*.css`,
  `**/to/**/*`
], { globstar: true }).includes(true); // true, since both patterns match.
```

**Array.filter**

Use the module to filter an array.

```JavaScript
const planckmatch = require(`planckmatch`);

let expressions = planckmatch.parse([
  `a.*`,
  `*.html`
]);

// Match all.
[ `a.css`, `b.html`, `c.js` ].filter(function(value) {
  return !planckmatch.match(value, expressions).includes(false);
}); // []

// Match any.
[ `a.css`, `b.html`, `c.js` ].filter(function(value) {
  return planckmatch.match(value, expressions).includes(true);
}); // [ `a.css`, `b.html` ]

// Filter out any '.css' files.
expressions = planckmatch.parse([
  `*`,
  `!(*.css)`
], { extended: true });

[ `a.css`, `b.html`, `c.js` ].filter(function(value) {
  return !planckmatch.match(value, expressions).includes(false);
}); // [ `b.html`, `c.js` ]
```

## License

[ISC license](https://github.com/redkenrok/planckmatch/blob/LICENSE)