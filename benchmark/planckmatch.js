// Modules.
const planckmatch = require('../library')
// Get shared functions.
const { before, beforeEach, afterEach, options } = require('./_shared')
const { fileCount, filePaths, iterationCount, pattern, patterns } = options

// Run before benchmark.
before('The following benchmark only uses the planckmatch(value, patterns) function which is only recommended when using a set of patterns once.')

// High resolution time.
let time

beforeEach('  Using the first pattern.')
time = process.hrtime()
for (let i = 0; i < iterationCount; i++) {
  for (let j = 0; j < fileCount; j++) {
    planckmatch(filePaths[j], pattern)
  }
}
afterEach(process.hrtime(time))

beforeEach('  Using all patterns.')
time = process.hrtime()
for (let i = 0; i < iterationCount; i++) {
  for (let j = 0; j < fileCount; j++) {
    planckmatch(filePaths[j], patterns)
  }
}
afterEach(process.hrtime(time))
