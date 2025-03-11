<!-- markdownlint-disable -->
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v1.0.3] - 2025-03-11

### Added
- Add `setSearch()`

### Changed
- `getSearch()` can now be proxied to use the methods available on the value

## [v1.0.2] - 2025-01-25

### Added
- Add `SearchParamChangeEvent` class extending `CustomEvent`
- Add `multiple` support for `SearchParam`
- `manageSearch` now uses `Proxy` to expose underlying properties and methods of values

### Changed
- Use calceleable `beforechange` event followed by a `change` event after

## [v1.0.1] - 2024-11-25

### Added
- Add `SearchParam` class, `getSearch` and `manageSearch` functions
- Add `createURLParser` to support URL parsers with custom bases

## [v1.0.0] - 2024-10-28

Initial Release
