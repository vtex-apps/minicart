📢 Use this project, [contribute](https://github.com/vtex-apps/minicart) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Minicart

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

> ⚠️ **Minicart v1 block has been deprecated in favor of Minicart v2**, which can be customized using the blocks defined by [Product List](https://developers.vtex.com/docs/apps/vtex.product-list) and [Checkout Summary](https://developers.vtex.com/docs/apps/vtex.checkout-summary). If you are still using Minicart v1, see the [Minicart v1 documentation](https://github.com/vtex-apps/minicart/blob/383d7bbd3295f06d1b5854a0add561a872e1515c/docs/README.md).

The VTEX Minicart is a block that displays a summary list of all items added to the shopping cart, fetched from the Checkout OrderForm API.

![minicart-v2-gif](https://cdn.jsdelivr.net/gh/vtexdocs/dev-portal-content@main/images/vtex-minicart-0.gif)

## Configurating Minicart

1. Import the Minicart app to your theme dependencies in the `manifest.json`, as shown below:

```json
"dependencies": {
  "vtex.minicart": "2.x"
}
```

2. Add the `minicart.v2` block to your `header`. For example:

```json
"header.full": {
   "blocks": ["header-layout.desktop", "header-layout.mobile"]
 },

 "header-layout.desktop": {
   "children": [
     "header-row#1-desktop",
   ]
 },

 "header-row#1-desktop": {
   "children": ["minicart.v2"],
 },
```

> ⚠️ **Minicart v2 will only effectively function if the store uses the** [**Add to Cart button**](https://vtex.io/docs/components/content-blocks/vtex.add-to-cart-button/) **instead of the** [**Buy button**](https://vtex.io/docs/components/content-blocks/vtex.store-components/buybutton/) in blocks such as the Shelf and the Product Details page. This is because Minicart v2 was built based on an indirect dependency on the Add to Cart button. This means that even if Minicart v2 is correctly configured in the code, it cannot be rendered by other shopping buttons, such as the Buy button.

| Prop name              | Type               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                 | Default value                                                                                       |
| ---------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `variation`            | `enum`             | Minicart behavior when rendered. Possible values for displaying the VTEX Minicart are: `popup` (appears as a pop-up window on the homepage), `drawer` (appears as a sidebar), `link` (redirects the user to the Checkout page when clicked), `popupWithLink` (combines `link` and `popup` functionalities), and `block` (displays the Minicart as a fixed block on the page).                                                               | `drawer`                                                                                            |
| `drawerSlideDirection` | `enum`             | Slide direction for the `drawer` Minicart opening. Possible values are: `rightToLeft` or `leftToRight`.                                                                                                                                                                                                                                                                                                                                     | `rightToLeft`                                                                                       |
| `linkVariationUrl`     | `string`           | Link associated with the `link` Minicart.                                                                                                                                                                                                                                                                                                                                                                                                   | `undefined`                                                                                         |
| `maxDrawerWidth`       | `number`           | Maximum width (in pixels) for the `drawer` Minicart when opened.                                                                                                                                                                                                                                                                                                                                                                            | `440`                                                                                               |
| `openOnHover`          | `boolean`          | Indicates whether the `popup` Minicart should open when the user hovers over it.                                                                                                                                                                                                                                                                                                                                                            | `false`                                                                                             |
| `quantityDisplay`      | `enum`             | Shows the quantity badge even when the amount of products in the cart is zero. Possible values are: `always` or `not-empty` or `never`.                                                                                                                                                                                                                                                                                                     | `not-empty`                                                                                         |
| `itemCountMode`        | `enum`             | Quantity badge behavior when displaying the total items added to Minicart. Possible values are: `total` (quantity badge displays the number of items added to the cart), `distinct` (only displays the number of different products added to the cart), `totalAvailable` (displays the number of available items added to the cart), and `distinctAvailable` (displays the number of different _and_ available products added to the cart). | `distinct`                                                                                          |
| `backdropMode`         | `enum`             | Controls whether the backdrop should be displayed when the `drawer` Minicart is opened or not. Possible values are: `visible` (renders the backdrop) or `none` (renders the `drawer` without backdrop).                                                                                                                                                                                                                                     | `none`                                                                                              |
| `MinicartIcon`         | `block`            | Icon displayed on the Minicart button. This prop value must match the block name responsible for rendering the desired icon.                                                                                                                                                                                                                                                                                                                | `icon-cart` (from the [Store Icons](https://developers.vtex.com/docs/guides/vtex-store-icons/) app) |
| `customPixelEventId`   | `string`           | Store event ID responsible for triggering the `minicart.v2` to automatically open on the interface.                                                                                                                                                                                                                                                                                                                                         | `undefined`                                                                                         |
| `customPixelEventName` | `string`           | Store event name responsible for triggering the `minicart.v2` to automatically open on the interface. Some examples are: `'addToCart'` and `'removeFromCart'`. Note that using this prop will make the `minicart.v2` open in **every** event with the specified name if no `customPixelEventId` is specified.                                                                                                                               | `undefined`                                                                                         |
| `classes`              | `CustomCSSClasses` | Used to override default CSS handles. To better understand how this prop works, we recommend reading about it [here](https://github.com/vtex-apps/css-handles#usecustomclasses). Note that this is only useful when importing this block as a React component.                                                                                                                                                                              | `undefined`                                                                                         |

### Advanced configurations

The default implementation for `minicart.v2` can be highly customizable by using other blocks. Currently, its default implementation is as follows:

```jsonc
// This is the default block implementation for the minicart-layout
{
  "minicart.v2": {
    "props": {
      "MinicartIcon": "icon-cart#minicart-icon"
    },
    "children": ["minicart-base-content"]
  },
  "icon-cart#minicart-icon": {
    "props": {
      "size": 24
    }
  },
  "minicart-base-content": {
    "blocks": ["minicart-empty-state"],
    "children": ["minicart-product-list", "flex-layout.row#minicart-footer"]
  },
  "flex-layout.row#minicart-footer": {
    "props": {
      "blockClass": "minicart-footer"
    },
    "children": ["flex-layout.col#minicart-footer"]
  },
  "flex-layout.col#minicart-footer": {
    "children": ["minicart-summary", "minicart-checkout-button"]
  },
  "minicart-product-list": {
    "blocks": ["product-list#minicart"]
  },
  "product-list#minicart": {
    "blocks": ["product-list-content-mobile"]
  },
  "minicart-summary": {
    "blocks": ["checkout-summary.compact#minicart"]
  },
  "minicart-checkout-button": {
    "props": {
      "finishShoppingButtonLink": "/checkout/#/orderform"
    }
  },

  "checkout-summary.compact#minicart": {
    "children": ["summary-totalizers#minicart"],
    "props": {
      "totalizersToShow": ["Items", "Discounts"]
    }
  },
  "summary-totalizers#minicart": {
    "props": {
      "showTotal": true,
      "showDeliveryTotal": false
    }
  },
  "minicart-empty-state": {
    "children": ["flex-layout.row#empty-state"]
  },
  "flex-layout.row#empty-state": {
    "children": ["flex-layout.col#empty-state"]
  },
  "flex-layout.col#empty-state": {
    "children": [
      "icon-cart#minicart-empty-state",
      "rich-text#minicart-default-empty-state"
    ],
    "props": {
      "horizontalAlign": "center",
      "verticalAlign": "middle",
      "rowGap": 5
    }
  },
  "icon-cart#minicart-empty-state": {
    "props": {
      "size": 64,
      "blockClass": "minicart-empty-state"
    }
  },
  "rich-text#minicart-default-empty-state": {
    "props": {
      "text": "Your cart is empty."
    }
  }
}
```

The default implementation of `minicart.v2` consists of the `JSON` code shown above, which is used behind the scenes whenever you use this block in your store.

To customize the Minicart configuration, you can copy the code and modify it to your needs.

For detailed instructions on how to configure each of the blocks that make up `minicart.v2`, read the [Product List](https://developers.vtex.com/docs/apps/vtex.product-list) and [Checkout Summary](https://developers.vtex.com/docs/apps/vtex.checkout-summary) documentations.

## Customization

To apply CSS customizations to this and other blocks, follow the instructions given in the recipe on [Using CSS handles for store customization](https://developers.vtex.com/docs/guides/vtex-io-documentation-using-css-handles-for-store-customization).

| CSS handles                     |
| ------------------------------- |
| `arrowUp`                       |
| `minicartCheckoutButton`        |
| `minicartContainer`             |
| `minicartContentContainer`      |
| `minicartFooter`                |
| `minicartIconContainer`         |
| `minicartProductListContainer`  |
| `minicartQuantityBadge`         |
| `minicartSideBarContentWrapper` |
| `minicartTitle`                 |
| `minicartWrapperContainer`      |
| `popupChildrenContainer`        |
| `popupContentContainer`         |
| `popupWrapper`                  |

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/lucasayb"><img src="https://avatars2.githubusercontent.com/u/17356081?v=4" width="100px;" alt=""/><br /><sub><b>Lucas Antônio Yamamoto Borges</b></sub></a><br /><a href="https://github.com/vtex-apps/minicart/commits?author=lucasayb" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/lucaspacheco-acct"><img src="https://avatars0.githubusercontent.com/u/59736416?v=4" width="100px;" alt=""/><br /><sub><b>lucaspacheco-acct</b></sub></a><br /><a href="https://github.com/vtex-apps/minicart/commits?author=lucaspacheco-acct" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/gustavopvasconcellos"><img src="https://avatars1.githubusercontent.com/u/49173685?v=4" width="100px;" alt=""/><br /><sub><b>gustavopvasconcellos</b></sub></a><br /><a href="https://github.com/vtex-apps/minicart/commits?author=gustavopvasconcellos" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
