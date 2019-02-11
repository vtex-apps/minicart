VTEX Minicart
=====

## Description
The VTEX minicart app shows a list of all items that a customer added in our Checkout OrderForm API, and this app is used by Dreamstore product.

:loudspeaker: **Disclaimer:** Don't fork this project, use, contribute, or open issue with your feature request.

## Release schedule
| Release  | Status              | Initial Release | Maintenance LTS Start | End-of-life | Dreamstore Compatibility
| :--:     | :---:               |  :---:          | :---:                 | :---:       | :---: 
| [1.x]    | **Maintenance LTS** |  2018-08-17     | 2018-11-26            | March 2019  | 1.x
| [2.x]    | **Current Release** |  2018-11-26     |                       |             | 2.x

See our [LTS policy](https://github.com/vtex-apps/awesome-io#lts-policy) for more information.

## Table of Contents
- [Usage](#usage)
  - [Blocks API](#blocks-api)
    - [Configuration](#configuration)
  - [Styles API](#styles-api)
- [Troubleshooting](#troubleshooting)
- [Tests](#tests)

## Usage

This app uses our store builder with the blocks architecture. To know more about Store Builder [click here.](https://help.vtex.com/en/tutorial/understanding-storebuilder-and-stylesbuilder#structuring-and-configuring-our-store-with-object-object)

To use this app, you need to import in your dependencies on `manifest.json`.

```json
  dependencies: {
    "vtex.minicart": "2.x"
  }
```

Then, add `minicart` block into our app theme, as we do in our [Dreamstore app](https://github.com/vtex-apps/dreamstore/blob/master/store/blocks.json). 

### Blocks API
This app has an interface that describes which rules must be implemented by a block when you want to use the minicart.

```json
  "minicart": {
    "required": [
      "product-summary"
    ],
    "component": "index"
  }
}
```
The minicart has as a required block the `product-summary`. So, any minicart implementation created must add a product-summary as a block that is inside of minicart. To know how is the API of `product-summary` see the next section.

#### Configuration 
Through the Storefront, you can change the minicart's behavior and interface. However, you also can make in your theme app, as Dreamstore does.

| Prop name          | Type       | Description                                                                 |
| ------------------ | ---------- | --------------------------------------------------------------------------- |
| `type`                      | `String`   | Define Minicart mode. (values: 'popup' or 'sidebar')               |
| `showRemoveButton`          | `Boolean`  | Shows the remove button in each item                               |
| `showDiscount`              | `Boolean`  | Shows the total discount of your cart                              |
| `showSku`                   | `Boolean`  | Shows the SKU name of the item                                     |
| `labelMiniCartEmpty`        | `String`   | Text that is displayed when the cart is empty                      |
| `labelButtonFinishShopping` | `String`   | Text displayed in the finish shopping button                       |
| `enableQuantitySelector`    | `Boolean`  | Enable the quantity selector component                             |
| `maxQuantity`               | `String`   | Define the maximum quantity of an item in cart                     |

Also, you can configure the product summary that is defined on minicart. See [here](https://github.com/vtex-apps/product-summary/blob/master/README.md#configuration) the Product Summary API. 

### Styles API
This app has CSS customization through `CSS Modules`. 

CSS Modules is a CSS file in which all class names and animation names are scoped locally by default. You can read more about CSS Modules [here](https://github.com/css-modules/css-modules) .

We use it `css-loader` to generate a CSS token on a HTML element. For example, the builder generate a CSS token based on app vendor, name and version. Like `container` token declared in minicart, generate the classname `vtex.minicart-2-x-container`.

Below, we describe the tokens, their explanation and the component where it is located.

| Token name         | Component          | Description                                            |
| ------------------ | ----------         |------------------------------------------------------- |
| `container`        | `index`            | The main container of minicart                         |
| `label`            | `index`            | Minicart icon label                                    |
| `badge`            | `index`            | Minicart badge with the product quantity on it         |
| `content`          | `MinicartContent`  | Minicart products' container                            |
| `contentSmall`     | `MinicartContent`  | Minicart content for small sidebar                     |
| `contentLarge`     | `MinicartContent`  | Minicart content for large sidebar                     |
| `contentDiscount`  | `MinicartFooter`   | The total discount on the minicart footer              | 
| `contentPrice`     | `MinicartFooter`   | Total price of the products on the minicart footer     |
| `contentFooter`    | `MinicartFooter`   | The minicart footer main container                     |
| `sidebarHeader`    | `Sidebar`          | Minicart sidebar header container                      |
| `sidebar`          | `Sidebar`          | Minicart sidebar main container                        |
| `sidebarOpen`      | `Sidebar`          | Active when the sidebar is opened                      |
| `arrowUp`          | `Popup`            | Popup box arrow                                        |
| `box`              | `Popup`            | The main container of the popup                        | 

To override the default CSS, you need to import `styles` on your manifest:

```json
  "builders": {
    "styles": "1.x"
  }
```

Also, create a `vtex.minicart.css` file in `styles/css` for your handlers customization.

## Troubleshooting
You can check if others are passing through similar issues [here](https://github.com/vtex-apps/minicart/issues). Also feel free to [open issues](https://github.com/vtex-apps/minicart/issues/new) or contribute with pull requests.

## Tests
To execute our tests go to `react/` folder and run `yarn test` 
