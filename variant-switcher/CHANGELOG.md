# Changelog

## v8 (May 8, 2023)

### Fixed

-   Fixed an issue that causes the "Plugin Stays Open" checkbox to not work properly.

## v7 (May 8, 2023)

### Added

-   Support for an advanced option "Plugin Stays Open". ([#46](https://github.com/etn-ccis/blui-figma-plugins/issues/46))

## v6 (Sept 26, 2022)

### Added

-   Support for dark theme. ([#35](https://github.com/etn-ccis/blui-figma-plugins/issues/35); thanks, @Jerryjappinen!)
-   Support for FigJam. ([#23](https://github.com/etn-ccis/blui-figma-plugins/issues/23))

## v5 (Mar 9, 2022)

### Fixed

-   Fixed an issue that caused the plugin to crash when the instance has no properties on it. ([#27](https://github.com/etn-ccis/blui-figma-plugins/issues/27))

### Changed

-   Changed the way this changlog is managed to better match with Figma's versioning convention.

## v3, v4 (Feb 23, 2022)

### Added

-   Optional field "Main Component Name": Only check for the components with the matching main component name.
-   Option to scan and switch the whole document, rather than just the current page / selection. ([#19](https://github.com/etn-ccis/blui-figma-plugins/issues/19))
-   Option to toggle on / off "exact match" to allow users to do a blurred search (case-insensitive, substring search, ignore white spaces). ([#21](https://github.com/etn-ccis/blui-figma-plugins/issues/21))

### Changed

-   Grouped advanced options behind an "Advanced Options" dropdown.
-   Allowed white space / no white space around the delimiter `,` between different instance names. ([#16](https://github.com/etn-ccis/blui-figma-plugins/issues/16))

## v2 (June 30, 2021)

### Added

-   When an instance is switched to the specified "To Variant", you can now choose to disable the "deep switch". Deep switch will look into all child layers and switch everything that matches the "From Variant". When this is disabled, the children of a switched element will not be switched. This is helpful when you built dark-themed components using light-themed components, and don't want the plugin to "over-switch". ([See a diagram explanation](./_assets_/deep-switch-diagram.png))
-   Ability to switch variants by pressing the "Enter" key.

### Changed

-   Added `editorType` to `manifest.json` to limit the plugin to be used on Figma Design only.

### Changed

-   When an instance already has the specified "To Variant" property value, no variant switching will be performed.

## v1 (May 12, 2021)

### Added

-   Initial Release
