# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
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
