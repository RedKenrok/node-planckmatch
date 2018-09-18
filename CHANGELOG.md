# Changelog

## 0.0.3 (2018-09-18)
### Added
- Simpler paths added for `library` files. Now you can use `planckmatch/parse` and `planckmatch/match` instead of `planckmatch/library/parse` and `planckmatch/library/match` respectively.

## 0.0.2 (2018-09-17)
### Added
- Added more tests to `test/module.js`.
### Changed
- Restructured project files.
- Separated logic into different files, as a result the functions can be required separately.
- Split benchmarking across a quick and an optimized file.
- Emphasized which functions are called during the benchmark.
- Renamed file `test/functions.js` to `test/module.js` as well as some tests inside the file.
### Fixed
- Removed recursive calling of the `parse` and `match` functions.
- Glob patterns were parsed once in the optimized benchmark to now every iteration.

## 0.0.1 (2018-09-15)
Initial release.