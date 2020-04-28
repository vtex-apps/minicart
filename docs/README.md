📢 Use this project, [contribute](https://github.com/vtex-apps/minicart) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Minicart

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

:information_source: **Minicart v1 block has been deprecated in favor of Minicart v2** which can be customized using the blocks defined by [Product List](https://vtex.io/docs/app/vtex.product-list) and [Checkout Summary](https://vtex.io/docs/app/vtex.checkout-summary). If you’re still using the former version, you can find its documentation here: [Minicart v1 documentation](https://github.com/vtex-apps/minicart/blob/383d7bbd3295f06d1b5854a0add561a872e1515c/docs/README.md)

The VTEX Minicart is a block that displays a summary list of all items added by customers in their shopping cart. Its data is fetched from the Checkout OrderForm API.

![minicart-v2-gif](https://user-images.githubusercontent.com/52087100/73321194-7f477e80-4220-11ea-844b-f24d1c10363c.gif)

## Configuration

1. Import the Minicart app to your theme's dependencies in the `manifest.json` as shown below:

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

:warning: **The Minicart v2 will only effectively function if the store uses the** [**Add To Cart Button**](https://vtex.io/docs/components/all/vtex.add-to-cart-button/add-to-cart-button) **instead of the** [**Buy Button**](https://vtex.io/docs/components/all/vtex.store-components/buy-button) in blocks such as the Shelf and the Product Details Page. This is because Minicart v2 was built based on an indirect dependency with the Add To Cart button. That means that any other shopping buttons, as the Buy Button, are unable to render Minicart v2, even if it was correctly configured in the code. `

| Prop name              | Type      | Description                                                                                                                                                                                                                                     | Default value |
| ---------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `variation`            | `Enum`    | Minicart behavior when rendered. The possible values are: `'popup'` (it pops up on the Homepage in a minitab window) , `'drawer'` (it is rendered through a side bar) or `'link'` (when clicked on, it redirects the user to the Checkout page) | `'drawer'`    |
| `drawerSlideDirection` | `Enum`    | Slide direction for the `'drawer'` Minicart opening. (values: `'rightToLeft'` or `'leftToRight'`)                                                                                                                                               | `rightToLeft` |
| `linkVariationUrl`     | `String`  | Link associated to the `'link'` Minicart.                                                                                                                                                                                                       |               |
| `maxDrawerWidth`       | `Number`  | Maximum width (in pixels) for the `'sidebar'` Minicart when opened.                                                                                                                                                                             | `440`         |
| `openOnHover`          | `Boolean` | Whether the `'popup'` minicart should open when the user hovers over it                                                                                                                                                                         | false         |
| `quantityDisplay`      | `Enum`    | Shows the quantity badge even when the amount of products in the cart is zero  (values: `'always'` or `'not-empty'` or ` 'never'`)                                                                                                              | `'not-empty'` |

### Advanced Configuration

According to the `minicart.v2` composition, it can be highly customizable using other blocks. Currently, its default implementation is as follows:

```jsonc
// This is the default blocks implementation for the minicart-layout
{
  "minicart.v2": {
    "children": ["minicart-base-content"]
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
    "children": ["rich-text#empty-state"]
  },
  "rich-text#empty-state": {
    "props": {
      "text": "Your cart is empty!"
    }
  }
}
```

By default implementation we mean that whenever you use `minicart.v2` in your store you're actually using the `json` above behind the scenes.

Therefore, in order to customize the Minicart configuration, you can simply copy the code above and change it as you wish.

For further information on how to configure each of the blocks used to compose `minicart.v2`, check out [Product List](https://vtex.io/docs/app/vtex.product-list) and [Checkout Summary](https://vtex.io/docs/app/vtex.checkout-summary).

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles                     |
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
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
