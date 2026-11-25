# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-11-25

### Changed

- Documentation: `README.md` usage examples now match the actual public API
  (`container` is imported from `tsyringe`, not this package).
- Documentation: `SKILLS.md` rewritten to describe only the implemented API
  surface; aspirational examples moved to a backlog section.

### Fixed

- Package metadata: added `description`, `license`, `repository`, `bugs`,
  `homepage`, `keywords` and `author` so `npm publish` no longer warns.

## [1.0.0] - 2025-02-27

### Added

- Initial public surface exported from `src/index.ts`.
- Types: `AbstractModel`, `ErrorModel`, `AbstractType`, `AbstractObjectType`,
  `ComponentState`, `AnyType`, `UndefinedType`, `ICommonSharingData`.
- Constants: `StatusCode`, `RequestMethod`, `StorageKey`, `LanguageCode`,
  `MessageType`, `ConstantValue`.
- Static helpers: `ObjectHelper`, `CommonFunction`, `UIHelper`.
- DI service contracts: `AbstractHttpService`, `AbstractRoutingService`,
  `AbstractValidationService`, `AbstractStorageService`,
  `AbstractLogggingService`, `AbstractLoadingService`, `AbstractLanguageService`.
- DI singletons: `SharingDataService`, `RealTimeSharingDataService` (RxJS).
