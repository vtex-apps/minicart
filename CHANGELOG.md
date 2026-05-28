# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Fixed

- Group SLA totals from dockId instead of warehouseId in breakdown

## [Unreleased]

### Changed

- Update GitHub actions/cache to v4

## [2.68.0] - 2024-09-05
### Added
- Prop `splitItem` of `minicart-product-list`

## [2.67.2] - 2024-08-14

### Added
- Drawer component onVisibilityChanged property to handle open/close state

### Changed
- Logic of the useViewCartPixel hook

## [2.67.1] - 2023-05-05
### Fixed
- Fixes of i18n on readme.md accorrding to task LOC-10558.

## [2.67.0] - 2023-05-02
### Added
- Send `vtex:viewCart` event to analytics when minicart is opened

## [2.66.0] - 2023-01-19

### Added
- Provide `originalTotal` prop (sum of item list prices) to `checkout-summary` extension point

## [2.65.0] - 2022-12-23

### Added
- Indonesian and Thai translations.
### Fixed
- Portuguese, Spanish and Italian translations.

## [2.64.0] - 2022-12-22

### Added
- Schema to the `checkout button`, this makes it possible to define via admin where the user will be directed after the click

## [2.63.5] - 2022-07-28

### Fixed
- Quantity update by using item index instead of uniqueid

## [2.63.4] - 2022-05-24

### Fixed

- Do not emit `cartChanged` pixel event if orderForm is still updating (denoted by the most recent item's `additionalInfo` property being `undefined`)

## [2.63.3] - 2022-03-03
### Fixed
- Brackets in `minicart-checkout-button` (documentation).

## [2.63.2] - 2022-02-17

### Added
- Prop `finishShoppingButtonLink` of `minicart-checkout-button`. 

## [2.63.1] - 2022-02-15

### Fixed
- Bug Fixed on pixelHelper if validation.

## [2.63.0] - 2022-02-08

### Added
- Norwegian variant translation.

## [2.62.1] - 2021-11-17

### Changed
- Spanish translation

### Added
- Hungarian and Arabic translation.

### Fixed
- Crowdin configuration file

## [2.62.0] - 2021-09-23

### Added
- New `block` variation

## [2.61.1] - 2021-09-13
### Added
- New condition in `getNameWithoutVariant` at `pixelHelper.ts` to check if item.name is the same as item.skuName.

## [2.61.0] - 2021-09-06
### Added
- New `popupWithLink` variation.

## [2.60.0] - 2021-06-29

## [2.60.0] - 2021-06-29
### Added
- Pass paymentData as prop to Summary component

## [2.59.1] - 2021-06-08
### Fixed
- GTM events to follow Google's defined patterns

## [2.59.0] - 2021-04-22
### Added
- I18n Jp and No.

### Changed
- I18n Ro.
- Crowdin configuration file.

## [2.58.0] - 2021-04-20

### Added
- New property `allowedOutdatedData` to `handleQuantityChange` and `handleRemove` events.

## [2.57.0] - 2021-03-17
### Added
- Property `priceIsInt` in pixel events, so it's possible to properly identify when to divide price by 100 in pixel apps.

## [2.56.0] - 2021-01-07
### Added
- `classes` prop to all exported components.

### Changed
- `vtex.css-handles` dependency is now on major `1.x`.

## [2.55.0] - 2020-12-17

### Added

- I18n Ro and Cs.

### Fixed

- Crowdin configuration file.

## [2.54.2] - 2020-12-04

### Fixed
- Ignore assemblies values on `itemCountMode`.

## [2.54.1] - 2020-10-20

### Added
- `totalAvailable` and `distinctAvailable` values for `itemCountMode`.

## [2.54.0] - 2020-10-20 [YANKED]
### Added
- `totalAvailable` and `distinctAvailable` values for `itemCountMode`.

### Fixed
- Use navigate when redirecting to checkout

## [2.53.0] - 2020-10-06

### Fix
- Mini cart not rendering variation link when in mobile version.

## [2.52.0] - 2020-10-05
### Added
- Translations for `bg`, `ca`, `da`, `de`, `el`, `fi`, `fr`, `it`, `ko`, `nl`, `pl`, `ru`, `sk`, `sl`, `sv`, and `uk`.

## [2.51.2] - 2020-10-01
### Fixed
- Fix broken links in the app documentation

## [2.51.1] - 2020-09-09
### Changed
- Memoize change and remove callbacks to avoid re-rendering product list items
  unnecessarily.

## [2.51.0] - 2020-09-08
### Added
- `customPixelEventId` prop.

## [2.50.0] - 2020-06-24
### Added
- `MinicartIcon` prop to `minicart.v2`.

## [2.49.0] - 2020-06-22
### Added
- Added `itemCountMode` prop in `minicart.v2`.

## [2.48.0] - 2020-06-03
### Changed
- Default empty state layout.

## [2.47.0] - 2020-06-02
### Added
- New property `productId` to `addToCart`, `removeFromCart` and `cartChanged` events.

## [2.46.2] - 2020-05-28

### Fixed

- Missing `rootPath` in `goToCheckout` function.

## [2.46.1] - 2020-05-04
### Fixed
- Build failing to find entry point for `minicart` block.

## [2.46.0] - 2020-04-29
### Added
- `backdropMode` on `minicart.v2`.

### Security
-  Bump dependency versions.

## [2.45.0] - 2020-03-25
### Added
- `referenceId` to `addToCart` and `cartChanged` pixel event payloads.

## [2.44.0] - 2020-03-11
### Added
- Updated `CODEOWNERS` file with responsible teams for each directory.
- Updated `.all-contributorsrc`.
- Add `quantityDisplay` prop in `minicart.v2`.

## [2.43.5] - 2020-02-18
### Changed
- Import queries and mutation directly.

## [2.43.4] - 2020-02-13
### Fixed
- Faulty verification at BaseContent component.

## [2.43.3] - 2020-02-13
### Fixed
- Transparency effect in 'drawer' variant.

## [2.43.2] - 2020-02-12
### Fixed
- [Legacy] Correctly add SKUs that might have attachments.

## [2.43.1] - 2020-02-05
### Removed
- `OrderItemsProvider` inside `ProductList`.

## [2.43.0] - 2020-02-03
### Added
- `cartId` pixel event.

## [2.42.1] - 2020-01-31
### Fixed
- Duplicated components being rendered due to a faulty verification at BaseContent component.

## [2.42.0] - 2020-01-30
### Added
- `Advanced configuration` section in the documentation.

## [2.41.2] - 2020-01-30
### Fixed
- Design improvements.

## [2.41.1] - 2020-01-30
### Fixed
- Popup minicart behavior when `openOnHover` is set to `true`.

## [2.41.0] - 2020-01-29
### Changed
- Use `render-runtime` `navigate` function to proceed to cart in order to benefit from apollo cache.

## [2.40.0] - 2020-01-27
### Added
- `BaseContent` can now render any `children` blocks passed to it.
- `minicart-checkout-button` interface.
- New `minicartCheckoutButton` CSS handle.

### Changed
- Default blocks implementation to use these new features.

## [2.39.0] - 2020-01-22
### Added
- `labelDiscountText` CSS handle to `minicart`.

## [2.38.0] - 2020-01-13
### Added
- New fields `detailUrl` and `imageUrl` to items in `addToCart`, `removeFromCart` and `cartChanged` events.

## [2.37.1] - 2020-01-09
### Fixed
- Missing `h-100` token on `minicart-base-content`.

## [2.37.0] - 2020-01-09
### Added
- New pixel event `cartChanged` when an item is removed or added.

### Fixed
- Remove variant name from product name in `removeFromCart` event. Making the name consistent across events.

## [2.36.0] - 2020-01-06
### Changed
- Lazy load minicart.v2 content
- Render minicart button on SSR

## [2.35.0] - 2019-12-20
### Added
- New CSS handles.

## [2.34.1] - 2019-12-20

## [2.34.0] - 2019-12-20

## [2.33.0] - 2019-12-19
### Added
- New `minicart-empty-state` interface.

## [2.32.1] - 2019-12-17
### Fixed
- Update some dependencies, fix tests.

## [2.32.0] - 2019-12-09
### Changed
- Link to Cart now varies depending on the version of `vtex.checkout` installed in the account.

## [2.31.1] - 2019-12-05
### Changed
- `MinicartLegacy.js` renamed back to `index.js`.

## [2.31.0] - 2019-12-03
### Added
- New `minicart.v2`, `minicart-base-content`, `minicart-product-list` and `minicart-summary` interfaces.
- Support for a flexible minicart implementation using these new blocks.

## [2.30.0] - 2019-11-21
### Added
- New `openOnHover` prop.

## [2.29.0] - 2019-11-19
### Added
- New `iconsProps` prop.

## [2.28.1] - 2019-11-13
### Fixed
- New items that must be added in the local state are filtered using "id" and "seller".

## [2.28.0] - 2019-11-11
### Added
- Expose `iconLabel` to be edited in Site Editor.

## [2.27.2] - 2019-10-22
### Fixed
- Add missing data necessary to pixel events.

## [2.27.1] - 2019-10-14
### Fixed
- Use ButtonWithIcon component, removing deprecation warning.

## [2.27.0] - 2019-10-14
### Added
- New CSS handles to all components.

## [2.26.1] - 2019-09-20
### Fixed
- Removed unused `react-device-detect` dependency.

## [2.26.0] - 2019-09-03
### Added
- Allow `sandbox` block on footer.

## [2.25.0] - 2019-08-30
### Changed
- Add render type to lazy

## [2.24.4] - 2019-08-29

## [2.24.3] - 2019-08-19

### Fixed

- `addToCart` mutation would add items to the minicart even though they were already there.

## [2.24.2] - 2019-08-09
### Fixed
- Removed overflow-hidden token inserted when only one item on minicart.

## [2.24.1] - 2019-07-31
### Fixed
- Problem when modifying cart in checkout screen and item still being displayed on minicart after coming back to store screen.

## [2.24.0] - 2019-07-29

### Added
- Added `linkButton` field for the finish shopping button

## [2.23.2] - 2019-07-26
### Changed
- Use `sellingPriceWithAssemblies` field to display item price.

## [2.23.1] - 2019-07-22

### Fixed

- Pixel events of `addToCart` and `removeFromCart`.

## [2.23.0] - 2019-07-18

### Changed

- Updated minicart shipping/packaging calculation using delivery method breakdown.
- Switched cart manager app-settings fetch endpoint to `/auchan/v1/cart-manager/app-settings`.

## [0.0.1] - 2024-01-08
