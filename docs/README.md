📢 Use this project, [contribute](https://github.com/vtex-apps/breadcrumb) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Minicart

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)

The VTEX minicart app is a store component that shows a list of all items that a customer added in our _Checkout OrderForm API_, and this app is used by store theme.

![Screen Shot 2019-12-18 at 14 06 37](https://user-images.githubusercontent.com/27777263/71111391-19d78b00-21a8-11ea-8e8a-bc6da29aecd6.png)

## Configuration

1. Import the minicart's app to your theme's dependencies in the `manifest.json`, for example:

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

| Prop name              | Type      | Description                                                                                              | Default value |
| ---------------------- | --------- | -------------------------------------------------------------------------------------------------------- | ------------- |
| `variation`            | `Enum`    | Define Minicart variation. (values: `'popup'`, `'drawer'` or `'link'`)                                   | `'sidebar'`   |
| `openOnHover`          | `Boolean` | Whether the popup minicart should open when the user hovers over it.                                     | false         |
| `linkVariationUrl`     | `String`  | The link associated to the `'link'` variation of the Minicart.                                           | false         |
| `drawerSlideDirection` | `Enum`    | Controls the slide direction for the `'sidebar'` variation. (values: `'rightToLeft'` or `'leftToRight'`) | `rightToLeft` |
| `maxDrawerWidth`       | `Number`  | The maximum width in pixels for the open sidebar Minicart.                                               | `440`         |

## Customization

| CSS Handles                     |
| ------------------------------- |
| `minicartWrapperContainer`      |
| `minicartContainer`             |
| `minicartContent`               |
| `minicartFooter`                |
| `minicartSideBarContentWrapper` |
| `minicartIconContainer`         |
| `minicartQuantityBadge`         |
| `popupWrapper`                  |
| `popupContentContainer`         |
| `arrowUp`                       |
| `popupChildrenContainer`        |

## Deprecation notice

The `minicart` interface has been deprecated in favor of this new `minicart.v2`, which is flexible.
If you're still using the original `minicart`, its documentation can be found here: [Minicart v1 docs](https://github.com/vtex-apps/minicart/blob/383d7bbd3295f06d1b5854a0add561a872e1515c/docs/README.md)

## Contributors (

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/lucasayb"><img src="https://avatars2.githubusercontent.com/u/17356081?v=4" width="100px;" alt="Lucas Ant�nio Yamamoto Borges"/><br /><sub><b>Lucas Ant�nio Yamamoto Borges</b></sub></a><br /><a href="https://github.com/vtex-apps/minicart/commits?author=lucasayb" title="Code">=�</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
