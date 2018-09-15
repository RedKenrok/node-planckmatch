# Planckmatch

Small and simple matching library using glob patterns.

## Install

```
$ npm install planckmatch
```

## Functions

**planckmatch**

Matches extended glob patterns with a given value.
* `value` **{String}**: A value to match to.
* `patterns` **{String|array}**: An extended glob pattern or array of extended glob patterns.
* `options` **{String|array}**: [Options](#options) for conversion of glob pattern to regular expression.

**planckmatch.parse**

Parses extended glob patterns into regular expressions.
* `patterns` **{String|array}**: An extended glob pattern or array of extended glob patterns.
* `options` **{String|array}**: [Options](#options) for conversion of glob pattern to regular expression.

**planckmatch.match**

Matches regular expressions with a given value.
* `value` **{String}**: A value to match to.
* `expressions` **{RegExp|array}**: A RegExp or array of RegExp used to match with.

## Options

Options for conversion of glob pattern to regular expression.

* `options.extended` **{Boolean}**: Enable all advanced features from `extglob`.
  * Default: `false`
* `options.globstar` **{Boolean}**: If `false` globs like `'/foo/*'` will match any string beginning with `'/foo/'`. If `true` the same `'/foo/*'` will match any string beginning with `'/foo/'` that does not have a `'/'` to the right of it, for example it will match: `'/foo/bar.txt'` but not `'/foo/bar/baz.txt'`.
  * Default: `false`
* `options.strict` **{Boolean}**: Be forgiving about multiple slashes, like /// and make everything after the first / optional. This is how bash glob works.
  * Default: `false`
* `options.flags` **{String}**: RegExp flags (e.g. `'i'` ) to pass to the RegExp constructor.
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

const expressions = planckmatch.parse([
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
```

## Quick glob overview

* `*`: Matches any number of character, excluding not `/`.
* `?`: Match any single character, excluding not `/`.
* `**`: Matches any number of characters, including `/`.
* `{}`: Group expression using a comma-separated list of patterns.
* `!`: At the start of a pattern will negate the match.

## License

[ISC license](https://github.com/redkenrok/planckmatch/blob/LICENSE)