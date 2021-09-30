# Changelog

## v2.0.1 (Sept 29, 2021)

-   Added `editorType` to `manifest.json`

## v2.0.0 (June 30, 2021)

### Added

-   When an instance is switched to the specified "To Variant", you can now choose to disable the "deep switch". Deep switch will look into all child layers and switch everything that matches the "From Variant". When this is disabled, the children of a switched element will not be switched. This is helpful when you built dark-themed components using light-themed components, and don't want the plugin to "over-switch". ([See a diagram explanation](./_assets_/deep-switch-diagram.png))
-   Ability to switch variants by pressing the "Enter" key.

### Changed

-   When an instance already has the specified "To Variant" property value, no variant switching will be performed.

## v1.0.0 (May 12, 2021)

### Added

-   Initial Release
