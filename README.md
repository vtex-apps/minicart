VTEX Minicart
=====

## Description
The VTEX minicart app shows a list of all items that a customer add in our Checkout OrderForm API. 
This is a VTEX app that is used by Dreamstore product.

:loudspeaker: **Disclaimer:** Don't fork this project, use, contribute, or open issue with your feature request.

## Release schedule
| Release  | Status              | Initial Release | Maintenance LTS Start | End-of-life | Dreamstore Compatibility
| :--:     | :---:               |  :---:          | :---:                 | :---:       | :---: 
| [1.x]    | **Maintenance LTS** |  2018-08-17     | 2018-11-26            | March 2019  | 1.x
| [2.x]    | **Current Release** |  2018-11-26     |                       |             | 2.x

See our [LTS policy](https://github.com/vtex-apps/awesome-io#lts-policy) for more information.

## Table of Contents
- [Usage](#usage)
- [API](#api)
  - [Blocks API](#blocks-api)
    - [Configuration](#configuration)
  - [Styles API](#styles-api)
- [Troubleshooting](#troubleshooting)

## Usage

This app use our store builder with the blocks architecture. To know more about Store Builder [click here.](https://help.vtex.com/en/tutorial/understanding-storebuilder-and-stylesbuilder#structuring-and-configuring-our-store-with-object-object)

To use this app you need to import in your dependencies on `manifest.json`.

```json
  dependencies: {
    "vtex.minicart": "2.x"
  }
```

Then, add `minicart` block into our app theme, like we do in our [Dreamstore app](https://github.com/vtex-apps/dreamstore/blob/master/store/blocks.json). 

### Blocks API
:construction: :construction: :construction:

This app have an interface that describes what are the rules that the blocks must implement when you want to use the minicart block. 

```json
  "minicart": {
    "required": [
      "product-summary"
    ],
    "component": "index"
  }
}
```
The minicart has as a required block the `product-summary` block. So minicart implementation that will be created must add a product-summary as block that is inside of minicart. To know how is the API of `product-summary` see the next section.

#### Configuration 
Through the Storefront you can change the behavior and interface of minicart. But, you also can make adjusts in your theme app, like Dreamstore does.

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

Also, you can configure the product summary that is used in minicart. See [here](https://github.com/vtex-apps/product-summary/blob/master/README.md#configuration) the Product Summary API. 

### Styles API
:construction: :construction: :construction:

## Troubleshooting
You can check if others are passing through similar issues [here](https://github.com/vtex-apps/minicart/issues). Also feel free to [open issues](https://github.com/vtex-apps/minicart/issues/new) or contribute with pull requests.
