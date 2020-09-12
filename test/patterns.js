// Dependency modules.
const test = require('ava')
// Custom module.
const planckmatch = require('../library')

test('options:none match:*', function (t) {
  t.true(planckmatch('abc', '*'), 'Match word')
  t.true(planckmatch('abc/def/ghi', '*'), 'Match path')

  t.true(planckmatch('abc', '*c'), 'Match start of word')
  t.true(planckmatch('abc', 'a*'), 'Match end of word')
  t.true(planckmatch('abc', 'a*c'), 'Match middle of word')
  t.true(planckmatch('abc', 'a*bc'), 'Match nothing of word')
  t.true(planckmatch('abc', '*b*'), 'Match start and end of word')

  t.true(planckmatch('abc/def/ghi', '*/def/ghi'), 'Match start of path segment')
  t.true(planckmatch('abc/def/ghi', 'abc/*/ghi'), 'Match middle of path segment')
  t.true(planckmatch('abc/def/ghi', 'abc/def/*'), 'Match start of path segment')
  t.true(planckmatch('abc/def/ghi', '*/def/*'), 'Match start and end of path segment')

  t.true(planckmatch('abc/def/ghi', '*/ghi'), 'Match start of multiple path segments')
  t.true(planckmatch('abc/def/ghi', 'ab*'), 'Match end of multiple path segments')
  t.true(planckmatch('abc/def/ghi', '*hi'), 'Match start of word and path segments')
  t.true(planckmatch('abc/def/ghi', 'ab*'), 'Match end of word and path segments')
})

test('options:extended match:?', function (t) {
  const options = {
    extended: true,
  }

  t.true(planckmatch('a', '?', options), 'Match character')

  t.true(planckmatch('abc', '???', options), 'Match consecutive')
  t.true(planckmatch('abc', '?bc', options), 'Match start')
  t.true(planckmatch('abc', 'a?c', options), 'Match middle')
  t.true(planckmatch('abc', 'ab?', options), 'Match end')
  t.true(planckmatch('abc', '?b?', options), 'Match start and end')

  t.true(planckmatch('a/b/c', '?/?/?', options), 'Match start of path')
  t.true(planckmatch('a/b/c', '?/b/c', options), 'Match start of path')
  t.true(planckmatch('a/b/c', 'a/?/c', options), 'Match middle of path')
  t.true(planckmatch('a/b/c', 'a/b/?', options), 'Match end of path')
  t.true(planckmatch('a/b/c', '?/b/?', options), 'Match start and end of path')

  // Falsifiable
  t.false(planckmatch('a', '?'), 'Don\'t match character with default options')

  t.false(planckmatch('abc', '?', options), 'Don\'t match word')
  t.false(planckmatch('a/b/c', '?', options), 'Don\'t match path')
  t.false(planckmatch('a/b/c', '/c', options), 'Don\'t match path start')
  t.false(planckmatch('a/b/c', 'a/?', options), 'Don\'t match path end')
})

test('option:extended match:{}', function (t) {
  const options = {
    extended: true,
  }

  t.true(planckmatch('abc.def', 'abc.def', options), 'Match without special')
  t.true(planckmatch('abc.def', 'abc{.def,.ghi}', options), 'Match extension')

  // Falsifiable
  t.false(planckmatch('abc', 'abc{.def,.ghi}'), 'Don\'t match character with default options')
  t.false(planckmatch('abc', 'abc{.ghi,.jkl}', options), 'Don\'t match extension')
})

test('option:extended match:()', function (t) {
  const options = {
    extended: true,
  }

  t.false(planckmatch('abc', '!(abc)', options), 'Don\'t match word.')
  t.true(planckmatch('def', '!(abc)', options), 'Match different word.')
  t.false(planckmatch('abc', '!(*)', options), 'Don\'t match any word.')
  t.false(planckmatch('abc/def', '!(*)', options), 'Don\'t match any path.')
})
