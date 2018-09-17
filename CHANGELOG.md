# Changelog

## 0.0.2 (2018)
# Added
- Added more tests to `test/functions.js`.
# Changed
- Restructured project files.
- Separated logic into different files, as a result the functions can be required separately.
- Split benchmarking across a quick and an optimized file.
- Emphasized which functions are called during the benchmark.
# Fixed
- Removed recursive calling of the `parse` and `match` functions.
- Glob patterns were parsed once in the optimized benchmark to now every iteration.

## 0.0.1 (2018-09-15)
Initial release.