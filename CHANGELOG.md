# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

- Add a new prop that controls if the minicart should show the total price of the items in the cart if the price is bigger than 0.

## [2.22.1] - 2019-07-17

### Fixed

- Offline Minicart adding repeated items when user navigates.
- Some synchronization issues on offline scenarios.
- Local items being deleted even when the server returned an error.

### Changed

- Pass prop `isPartial` to the product summary extension point.

## [2.22.0] - 2019-07-16

### Changed

- Add a new prop that controls if the minicart should show the total quantity of items or just the quantity of different items.

## [2.21.2] - 2019-07-01

### Fixed

- Protect against undefined totalizers case.

## [2.21.1] - 2019-06-27

### Fixed

- Build assets with new builder hub.

## [2.21.0] - 2019-06-14

### Changed

- Add rootPath prefix to checkout redirect.

## [2.20.0] - 2019-05-27

### Changed

- Migrate to pixel-manager v1.

## [2.19.0] - 2019-05-23

### Changed

- Use an overlay div instead of `react-outside-click-handler` on Popup.

## [2.18.3] - 2019-05-20

### Fixed

- Fix total purchase value when the product is unavailable for shipping in the selected address.

## [2.18.2] - 2019-05-15

## [2.18.1] - 2019-05-15

### Changed

- Separate local state resolvers into separate functions and add tests.
- Add Lint to repo, fix basic issues.

### Fixed

- Fixed the case when an item is added offline and the user closes and then accesses the store again still offline.

## [2.18.0] - 2019-05-14

### Changed

- `isOpen` state is now coming from Apollo Local State.

## [2.17.1] - 2019-05-08

### Fixed

- Export MiniCart schema and create test case for it. (Releasing again.)

## [2.17.0] - 2019-05-08

### Added

- Add offline minicart logic allowing users to add an item to the cart when there is no network connection.

## [2.16.4] - 2019-05-07

### Fixed

- Export MiniCart schema and create test case for it.

## [2.16.3] - 2019-05-01

### Fixed

- Fix bug on Popup mode where clicks inside the minicart were closing it.

## [2.16.2] - 2019-04-30

### Changed

- Use `react-portal` to add Popup and Sidebar on the top level of the body.

## [2.16.1] - 2019-04-30

### Fixed

- Fix props passed to `addToCart` event.

## [2.16.0] - 2019-04-24

### Changed

- Scope messages by domain

## [2.15.0] - 2019-04-17

### Added

- Add the `removeFromCart` event.

## [2.14.7] - 2019-04-12

### Fixed

- Fixes `Cannot read property 'replace' of null` bug on `toHttps`.

## [2.14.6] - 2019-04-04

### Fixed

- Implement multiple status to simulate request queue and be able to continuously sync local state and server.

## [2.14.5] - 2019-04-01

### Changed

- Stringify and parse local state order form to prevent bugs in apollo link state.

### Fixed

- Make items mutations be based on index and nothing related to sku id.

## [2.14.4] - 2019-03-28

### Changed

- Remove unused `itemMetadata` fields from orderForm and minicart queries.

## [2.14.3] - 2019-03-28

### Fixed

- Correctly get orderForm from server mutation on replay mutation method.

## [2.14.2] - 2019-03-26

### Fixed

- Add toast when request to checkout fails.

## [2.14.1] - 2019-03-22

### Fixed

- Add default fields to all items to prevent bugs when adding item to cart with missing field.

## [2.14.0] - 2019-03-21

### Added

- Use the new Apollo Local State API to manage the orderForm and the minicart items to a faster UX.

## [2.13.1] - 2019-03-14

### Changed

- Use most generic languages files.

## [2.13.0] - 2019-03-13

### Changed

- Use `inlinePrice` product summary type.

## [2.12.1] - 2019-03-01

### Changed

- Using `store-icons` instead of `dreamstore-icons`

### Fixed

- Fix Tests.

## [2.12.0] - 2019-02-27

### Changed

- Use assembly resolvers of `store-graphql`

### Fixed

- Fix `package.json` dependencies.

### Added

- Setup tests and snapshot test.

## [2.11.9] - 2019-02-25

### Fixed

- `classNames` not found.

## [2.11.8] - 2019-02-25

### Removed

- `showRemoveButton`, `showSku`, `enableQuantitySelector` and `maxQuantity` props that were not used.
- `Image` component that was not used.

## [2.11.7] - 2019-02-21

### Fixed

- Total discount was not showing, even when enabled.

## [2.11.6] - 2019-02-18

### Fixed

- Fix warnings.

## [2.11.5] - 2019-02-15

### Fixed

- Minicart flick when scroll is being displayed.

## [2.11.4] - 2019-02-15

### Fixed

- Revert the `link-state` configuration.

## [2.11.3] - 2019-02-14

## [2.11.2] - 2019-02-14

## [2.11.1] - 2019-02-13

### Fixed

- Remove block elements inside inline elements.
- Using html5 tags to a more semantic structure.

## [2.11.0] - 2019-02-13

### Added

- Styles section on docs.
- Improve tokens description on docs.
- Implement an optimistic strategy using apollo-link-state so the minicart operations feel faster.

## [2.10.5] - 2019-02-08

### Added

- Create a API docs

### Changed

- Minor refact on blocks language.

## [2.10.4] - 2019-02-08

### Changed

- Pass composition item to product summary

### Fixed

- Small margin adjustments for shipping cost view

## [2.10.3] - 2019-02-07

### Fixed

- Add shipping fee string id to context.json

## [2.10.2] - 2019-02-05

### Fixed

- Protect against `itemMetadata` null

## [2.10.1] - 2019-02-01

## [2.10.0] - 2019-01-31

### Changed

- Add icons from `vtex.dreamstore-icons`.

## [2.9.1] - 2019-01-29

### Fixed

- Remove inherit component from `blocks.json`

### Changed

- Send to product-summary the "choice type" of each assembly option (SINGLE, TOGGLE or MULTIPLE)

## [2.9.0] - 2019-01-25

### Added

Add possibility of showing shipping cost above footer

### Changed

Rename `large` prop to `isSizeLarge` for better description

## [2.8.0] - 2019-01-22

## [2.7.3] - 2019-01-18

## [2.7.2] - 2019-01-18

### Changed

- Adjust the way to import render-runtime components

## [2.7.1] - 2019-01-18

## [2.7.0] - 2019-01-18

### Changed

- Bump vtex.styleguide to 9.x.

## [2.6.0] - 2019-01-18

### Changed

- Update React builder to 3.x

## [2.5.0] - 2019-01-16

### Fixed

- Create isSingleChoiceOption function and calculate parent item price correctly.

## [2.4.3] - 2019-01-15

### Fixed

- Fixed price overlapping in the mobile view.

## [2.4.2] - 2019-01-15

### Fixed

- Fix icon vertical aligment in the header in mobile view.

## [2.4.1] - 2019-01-14

### Fixed

- Remove `undefined` css classes.
- Change `store/product` to `store.product` on Link.

## [2.4.0] - 2019-01-09

### Changed

- Bye `pages.json`! Welcome `store-builder`.

## [2.3.2] - 2019-01-09

### Fixed

- Replace URL just for legacy file manager url format.

## [2.3.1] - 2019-01-04

### Fixed

- Icon aligment.

## [2.3.0] - 2018-12-26

### Added

- Create `groupItemsWithParents` function, add tests. Group parent items with its attachments.

## [2.2.0] - 2018-12-17

### Added

- Support to messages builder.

### Fixed

- Remove unnecessary declarations on `manifes.json`.

## [2.1.5] - 2018-12-14

### Changed

- Bump major version of `vtex.styleguide` and `vtex.store-components`.
- Add design tokens on selling price label.

## [2.1.4] - 2018-12-14

### Fixed

- Fix minimum items length to scrolling in minicart.

## [2.1.3] - 2018-12-14

### Changed

- CSS module classes' name to be in CamelCase.

## [2.1.2] - 2018-12-12

### Fixed

- Don't render the discount label when there is no discount.

## [2.1.1] - 2018-12-12

### Fixed

- Items sort by insertion order.

## [2.1.0] - 2018-12-12

### Added

- Support to CSS Modules

## [2.0.6] - 2018-12-04

### Fixed

- Mixed Content error, insecure http image
- Poor image quality

## [2.0.5] - 2018-12-03

### Changed

- Set cart badge color to bg-emphasis

## [2.0.4] - 2018-12-03

### Fixed

- Vertically center number on mini cart badge

## [2.0.3] - 2018-12-02

### Fixed

- Replace delete button after click with spinner, Fix price loading and add error when something goes wrong when removing from cart.

## [2.0.2] - 2018-12-02

### Changed

- Use of `vtex.use-svg` lib to display icons.

## [2.0.1] - 2018-12-02

### Fixed

- Fix scrim not covering entire screen.

## [2.0.0] - 2018-11-26

### Changed

- Update the `MiniCartContent` component to use the `ProductSummary` from the `vtex.product-summary` instead `MiniCartItem`.
- Update the size of `Sidebar` to 80% of original value.
- Add shadow scrim.

### Fixed

- Replace typography and color classes with design tokens.

## [1.3.0] - 2018-11-21

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
