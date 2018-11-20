# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- Use icons from the dreamstore icon pack.

## [1.2.3] - 2018-11-07
### Changed
- Close the `SideBar` after clicking some product's link.

## [1.2.2] - 2018-10-18
### Changed
- Update the `SideBar` component to use the `Animation` from the `store-components`.

## [1.2.1] - 2018-10-18
### Changed
- `Sidebar` header to use border instead of shadow, according to the design.

## [1.2.0] - 2018-10-18
### Changed
- Redesign of the `MiniCartContent` footer layout, now there are three rows aligned on the right side of the footer.

## [1.1.6] - 2018-10-05
### Fixed
- Empty message position of the `MiniCartContent` to be vertically centered in the pop-up mode.

## [1.1.5] - 2018-09-24
### Changed
- Hide label in screens thinner than the laptop resolution.

## [1.1.4] - 2018-09-20
### Fixed
- Fixes being able to scroll the body on mobile with the `Sidebar` open.

## [1.1.3] - 2018-09-14
### Changed
- Refactor the `global.css`.

## [1.1.2] - 2018-09-05
### Changed
- `MiniCart` to receive the icon's classnames.
- `CartIcon` to fill the parents color.

## [1.1.1] - 2018-08-31
### Changed
- `Sidebar` header design colors.

### Fixed
- `MiniCart` bagde position.

## [1.1.0] - 2018-08-31
### Changed
- Update the `Styleguide` version.
- Update the `store-components` version.

## [1.0.6] - 2018-08-30

## [1.0.5] - 2018-08-30

## [1.0.4] - 2018-08-30
### Added
- `NumericStepper` from styleguide into the `MiniCartItem`.

### Fixed
- Change `MiniCartItem` quantity.

## [1.0.3] - 2018-08-24
### Added
- Add CSS class to `MiniCart` label.

## [1.0.2] - 2018-08-20
### Fixed
- Fix box position to be compatible with the new header design

## [1.0.1] - 2018-08-17
### Fixed
- Discount label text.

## [1.0.0] - 2018-08-17
### Added
- props `iconLabel`, `iconSize`, `iconColor` to `Minicart` component

## [0.9.2] - 2018-08-10
### Fixed
- `MiniCart` overflow hidden property which was affecting all the screens with at most 400px of width.

## [0.9.1] - 2018-08-09
### Added
- Content Loader while the `MiniCartItem`'s image isn't loaded.

### Fixed
- `MiniCartItem`'s name width.

## [0.9.0] - 2018-08-08
### Fixed
- `MiniCartContent` prop-types.
- Remove item.

### Added
- Animation into the `SideBar`.

## [0.8.0] - 2018-08-02
### Added
- OrderFormContext component
### Changed
- Removed Graphql queries and mutation
- Open sidebar independent of configuration if on mobile.

## [0.7.2] - 2018-07-25

## [0.7.1] - 2018-07-11
### Changed
- `Popup` to appear when the `MiniCart` button is clicked instead of on hover.

### Fixed 
- `maxQuantity` undefined warning.
- Loading mixed (insecure) display content warning.

## [0.7.0] - 2018-7-6
### Added
- Minicart SideBar type.

### Fixed
- Fix duplicate items showing when changing the quantity.

## [0.6.0] - 2018-6-20
### Added
- Quantity Selector into the `MiniCartItem`

## [0.5.1] - 2018-6-14
### Changed
- Hide the quantity badge when the quantity is less then 0

## [0.5.0] - 2018-6-11
### Added
- Add internationalization into minicart schema

## [0.4.0] - 2018-05-24
### Changed
- The mini cart components to use the store components.
- PropTypes to reuse the mini cart's one.
- Update folder structure

## [0.3.2] - 2018-05-19
### Fixed
- Fix minicart render error when cannot fetch the orderForm from graphql.

## [0.3.1] - 2018-05-13
### Fixed
- Fix minicart locales

## [0.3.0] - 2018-05-11
### Added
- Add badge to show the quantity of items in the mini cart.
- Add arrow indicator to mini cart content.
### Changed
- Add event listener on minicart that will be used to update minicart badge.

## [0.2.1] - 2018-05-10
### Fixed
- Refetch order form data when a new product is added to the mini cart.

## [0.2.0] - 2018-05-10
### Added
- Add a spinner when remove button is pressed.

## [0.1.0] - 2018-05-09
### Added
- Add feature that allows to remove a minicart item.

## [0.0.1] - 2018-05-09
### Added
- Publish first version of the app.
