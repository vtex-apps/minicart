# Mini Cart Component
VTEX Minicart Component 

This is an extension point component.

## Release schedule
| Release  | Status              | Initial Release | Maintenance LTS Start | End-of-life | Dreamstore Compatibility
| :--:     | :---:               |  :---:          | :---:                 | :---:       | :---: 
| [1.x]    | **Maintenance LTS** |  2018-08-17     | 2018-11-26            | March 2019  | 1.x
| [2.x]    | **Current Release** |  2018-11-26     |                       |             | 2.x

### Travis CI 

[![Build Status](https://travis-ci.org/vtex-apps/menu.svg?branch=master)](https://travis-ci.org/vtex-apps/minicart)

## Usage

It can be positioned anywhere in the page. 

```<MiniCartButton />```

It can receive the text that will appear in the mini cart box when it is empty and the text that appears in the finish shopping button.

```<MiniCartButton labelMiniCartEmpty={labelEmpty} labelButtonFinishShopping={labelFinishShoppingButton} />```
