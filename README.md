<div align="center">
  
  [![npm package @latest](https://img.shields.io/npm/v/planckmatch.svg?label=npm@latest&style=flat-square&maxAge=3600)](https://npmjs.com/package/planckmatch)
  [![npm package @next](https://img.shields.io/npm/v/planckmatch/next.svg?label=npm@next&style=flat-square&maxAge=3600)](https://npmjs.com/package/planckmatch)
  
  [![Travis-ci build master branch](https://img.shields.io/travis-ci/RedKenrok/node-planckmatch.svg?label=test%20status&branch=master&style=flat-square&maxAge=3600)](https://travis-ci.org/RedKenrok/node-planckmatch)
  [![CodeCov coverage master branch](https://img.shields.io/codecov/c/github/redkenrok/node-planckmatch/master.svg?label=test%20coverage&style=flat-square&maxAge=3600)](https://codecov.io/gh/RedKenrok/node-planckmatch)
  
  [![License agreement](https://img.shields.io/github/license/redkenrok/node-planckmatch.svg?style=flat-square&maxAge=86400)](https://github.com/redkenrok/node-planckmatch/blob/master/LICENSE)
  [![Open issues on GitHub](https://img.shields.io/github/issues/redkenrok/node-planckmatch.svg?style=flat-square&maxAge=86400)](https://github.com/redkenrok/node-planckmatch/issues)
  
</div>

# Planckmatch

Small and simple matching library using glob patterns.

## Install

```
$ npm install planckmatch
```

## Functions

**planckmatch(value, patterns, options, path)**

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
* `path`: Whether to use platform specific path separators in the expression. For instance when set to true, `path/to/file` will be treated as `path/to/file` on Unix and as `path\\to\\file` on Windows.
  * Type: `Boolean`
  * Default: `false`

**planckmatch.all(value, patterns, options, path)**

Same as `planckmatch(value, patterns, options, path)` except it always returns a single boolean with whether all of the patterns matched.

Returns: `Boolean`

**planckmatch.any(value, patterns, options, path)**

Same as `planckmatch(value, patterns, options, path)` except it always returns a single boolean with whether any of the patterns matched.

Returns: `Boolean`

**planckmatch.parse(patterns, options, path)**

Parses extended glob patterns into regular expressions.

Returns: `RegExp` or `Array of RegExps`

* `patterns`: An extended glob pattern or array of extended glob patterns.
  * Type: `String` or `Array of strings`
  * Required: `true`
* `options`: [Options](#options) for conversion of glob pattern to regular expression.
  * Type: `Object`
  * Default: `{}`
* `path`: Whether to use platform specific path separators in the expression. For instance when set to true, `path/to/file` will be treated as `path/to/file` on Unix and as `path\\to\\file` on Windows.
  * Type: `Boolean`
  * Default: `false`

**planckmatch.match(value, expressions)**

Matches regular expressions with a given value.

Returns: `Boolean` or `Array of Booleans`

* `value`: A value to match to.
  * Type: `String` or `Array of strings`
  * Required: `true`
* `expressions`: A RegExp or array of RegExp used to match with.
  * Type: `RegExp` or `Array of RegExps`
  * Required: `true`

**planckmatch.match.all(value, expressions)**

Same as `planckmatch.match(value, expressions)` except it always returns a single boolean with whether all of the patterns matched.

Returns: `Boolean`

**planckmatch.match.any(value, expressions)**

Same as `planckmatch.match(value, expressions)` except it always returns a single boolean with whether any of the patterns matched.

Returns: `Boolean`

## Options

Options for conversion of glob pattern to regular expression.

* `options.extended`: Enable all advanced features from `extglob`.
  * Type: `Boolean`
  * Default: `false`
* `options.flags`: RegExp flags (e.g. `'i'` ) to pass to the RegExp constructor.
  * Type: `String`
  * Default: `''`
* `options.globstar`: If `false` the pattern `'path/*'` will match any string beginning with `'path/'`, for example it will match `'path/file.txt'` and `'path/to/file.txt'`. If `true` the same `'path/*'` will match any string beginning with `'path/'` that does not have a `'/'` to the right of it, for example it will match `'path/file.txt'` but not `'path/to/file.txt'`. If `true` the pattern `'path/**'` will match any string beginning with `'path/'`, which is equal to the `'path/*'` with globstar set to false.
  * Type: `Boolean`
  * Default: `false`
* `options.strict`: Be forgiving about multiple slashes, such as `///` and make everything after the first `/` optional. Like how bash glob works.
  * Type: `Boolean`
  * Default: `false`

## Usage

The most basic example using a single path and pattern.

```JavaScript
const planckmatch = require(`planckmatch`);

planckmatch(`path/to/file.css`, `**/*.css`); // true
planckmatch(`path/to/file.css`, `**/*.js`); // false
```

**Multiple patterns**

The pattern can also be an array, therefor the returned results will also be an array of equal length.

```JavaScript
const planckmatch = require(`planckmatch`);

planckmatch(`path/to/file.css`, [
  `*.css`,
  `*.js`
]); // [ true, false ]
```

**Re-use patterns**

If you re-use patterns I highly recommend parsing the patterns and matching the values direct instead of using the all-in-one function for it, as it parses the patterns each time.

```JavaScript
const planckmatch = require(`planckmatch`);

const expression = planckmatch.parse(`*.css`);

planckmatch.match(`path/to/file.css`, expression); // true
planckmatch.match(`path/to/file.js`, expression); // false
```

**Match all**

Check if all patterns match.

```JavaScript
const planckmatch = require(`planckmatch`);

planckmatch.all(`path/to/file.css`, [ `*.html`, `*/to/*` ]); // false, since `*.html` does not match.
planckmatch.all(`path/to/file.css`, [ `*.css`, `*/to/*` ]); // true, since all patterns match.
```

**Match any**

Check if any pattern matches.

```JavaScript
const planckmatch = require(`planckmatch`);

planckmatch.any(`path/to/file.css`, [ `*.html`, `to/*` ]); // false, since no pattern matches.
planckmatch.any(`path/to/file.css`, [ `*.css`, `to/*` ]); // true, since the first pattern matches.
planckmatch.any(`path/to/file.css`, [ `*.css`, `*/to/*` ]); // true, since both patterns match.
```

**Filter array**

Use the module to filter an array.

```JavaScript
const planckmatch = require(`planckmatch`);

let expressions = planckmatch.parse([
  `a.*`,
  `*.html`
]);

// Match all.
[ `a.css`, `b.html`, `c.js` ].filter(function(value) {
  return planckmatch.match.all(value, expressions);
}); // []

// Match any.
[ `a.css`, `b.html`, `c.js` ].filter(function(value) {
  return planckmatch.match.any(value, expressions);
}); // [ `a.css`, `b.html` ]

// Filter out any '.css' files.
expressions = planckmatch.parse([
  `*`,
  `!(*.css)`
], { extended: true });

[ `a.css`, `b.html`, `c.js` ].filter(function(value) {
  return planckmatch.match.all(value, expressions);
}); // [ `b.html`, `c.js` ]
```