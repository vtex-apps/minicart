# VTEX Minicart

## Description

The VTEX minicart app is a store component that shows a list of all items that a customer added in our _Checkout OrderForm API_, and this app is used by store theme.

:loudspeaker: **Disclaimer:** Don't fork this project; use, contribute, or open issue with your feature request.

## Release schedule

| Release |       Status        | Initial Release | Maintenance LTS Start | End-of-life | Store Compatibility |
| :-----: | :-----------------: | :-------------: | :-------------------: | :---------: | :-----------------: |
|  [2.x]  | **Current Release** |   2018-11-26    |                       |             |         2.x         |
|  [1.x]  | **Maintenance LTS** |   2018-08-17    |      2018-11-26       | March 2019  |         1.x         |

See our [LTS policy](https://github.com/vtex-apps/awesome-io#lts-policy) for more information.

## Table of Contents

- [Usage](#usage)
  - [Blocks API](#blocks-api)
    - [Configuration](#configuration)
  - [Styles API](#styles-api)
    - [CSS namespaces](#css-namespaces)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Tests](#tests)

## Usage

This app uses our store builder with the blocks architecture. To know more about Store Builder [click here.](https://help.vtex.com/en/tutorial/understanding-storebuilder-and-stylesbuilder#structuring-and-configuring-our-store-with-object-object)

We add the minicart as a block in our [Store Header](https://github.com/vtex-apps/store-header/blob/master/store/interfaces.json).

To configure or customize this app, you need to import it in your dependencies in `manifest.json`.

```json
  dependencies: {
    "vtex.minicart": "2.x"
  }
```

Then, add `minicart` block into your app theme as we do in our [Store theme app](https://github.com/vtex-apps/store-theme/blob/master/store/blocks.json).

Now, you can change the behavior of the minicart block that is in the store header. See an example of how to configure:

```json
"minicart": {
  "blocks": [
    "product-summary"
  ],
  "props": {
    "type": "popup",
    "showDiscount": true,
    "labelMiniCartEmpty": "",
    "labelButtonFinishShopping": "Ir para o checkout",
  }
}
```

### Blocks API

When implementing this app as a block, various inner blocks may be available. The following interface lists the available blocks within minicart and describes if they are required or optional.

```json
  "minicart": {
    "required": [
      "product-summary"
    ],
    "component": "index"
  }
}
```

The minicart has as a required block the `product-summary`. So, any minicart block implementation created must add a product-summary as a block that is inside of minicart. (Similarly, `product-summary` has its own inner block structure that can be configured. There is a link to its API in the next section.)

#### Configuration

Through the Storefront, you can change the minicart's behavior and interface. However, you also can make in your theme app, as Store theme does.

| Prop name                   | Type      | Description                                          | Default value        |
| --------------------------- | --------- | ---------------------------------------------------- | -------------------- |
| `type`                      | `Enum`    | Define Minicart mode. (values: 'popup' or 'sidebar') | popup                |
| `showDiscount`              | `Boolean` | Shows the total discount of your cart                | false                 |
| `labelMiniCartEmpty`        | `String`  | Text that is displayed when the cart is empty        | `Your cart is empty` |
| `linkButtonFinishShopping` | `String`  | Link to redirect after clicking in the finishe shopping button         | `/checkout/#/cart`     |
| `labelButtonFinishShopping` | `String`  | Text displayed in the finish shopping button         | `Go to checkout`     |
| `iconClasses`                   | `String`      | The minicart's icon classes                                         | `''`         |
| `iconLabel`                |   `String`    | The minicart's icon label                                        |  undefined       | 
| `labelClasses`                   | `String`      | The minicart's label classes                                          | `gray`        |
| `hideContent`                   | `Boolean`      |      If the minicart should not show its contents once its icon is clicked                                     | false       |
| `showShippingCost`                   | `Boolean`     | If the shipping cost show be displayed on cart                                          | false        |
| `showTotalItemsQty`                   | `Boolean`      | If the cart should show the total quantity of items or just the quantity of different items in the cart                                          | false       |
| `showPrice`                   | `Boolean`      | If the total price of the items in the cart should be displayed at its side                                          | false       |

Also, you can configure the product summary that is defined on minicart. See [here](https://github.com/vtex-apps/product-summary/blob/master/README.md#configuration) the Product Summary API.

### Styles API

This app provides some CSS classes as an API for style customization.

To use this CSS API, you must add the `styles` builder and create an app styling CSS file.

1. Add the `styles` builder to your `manifest.json`:

```json
  "builders": {
    "styles": "1.x"
  }
```

2. Create a file called `vtex.minicart.css` inside the `styles/css` folder. Add your custom styles:

```css
.container {
  margin-top: 10px;
}
```

#### CSS namespaces

Below, we describe the namespaces that are defined in the minicart.

| Class name        | Description                                                  | Component Source                                        |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------- |
| `container`       | The main container of minicart                               | [index](/react/index.js)                                |
| `label`           | Minicart icon label                                          | [index](/react/index.js)                                |
| `badge`           | Minicart badge with the product quantity on it               | [index](/react/index.js)                                |
| `arrowUp`         | Popup box arrow                                              | [Popup](/react/components/Popup.js)                     |
| `box`             | The main container of the popup                              | [Popup](/react/components/Popup.js)                     |
| `sidebarHeader`   | Minicart sidebar header container                            | [Sidebar](/react/components/Sidebar.js)                 |
| `sidebar`         | Minicart sidebar main container                              | [Sidebar](/react/components/Sidebar.js)                 |
| `sidebarOpen`     | Active when the sidebar is opened                            | [Sidebar](/react/components/Sidebar.js)                 |
| `content`         | The container for the Minicart contents                      | [MinicartContent](/react/components/MinicartContent.js) |
| `contentSmall`    | The container for the minicart contents when on desktop size | [MinicartContent](/react/components/MinicartContent.js) |
| `contentLarge`    | The container for the minicart contents when on mobile size  | [MinicartContent](/react/components/MinicartContent.js) |
| `contentDiscount` | The total discount on the minicart footer                    | [MinicartFooter](/react/components/MinicartFooter.js)   |
| `contentPrice`    | Total price of the products on the minicart footer           | [MinicartFooter](/react/components/MinicartFooter.js)   |
| `contentFooter`   | The minicart footer main container                           | [MinicartFooter](/react/components/MinicartFooter.js)   |

## Troubleshooting

You can check if others are passing through similar issues [here](https://github.com/vtex-apps/minicart/issues). Also feel free to [open issues](https://github.com/vtex-apps/minicart/issues/new) or contribute with pull requests.

## Contributing

Check it out [how to contribute](https://github.com/vtex-apps/awesome-io#contributing) with this project. 

## Tests

To execute our tests go to `react/` folder and run `yarn test`

### Travis CI

[![Build Status](https://api.travis-ci.org/vtex-apps/minicart.svg?branch=master)](https://travis-ci.org/vtex-apps/minicart)
