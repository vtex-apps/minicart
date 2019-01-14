import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { reduceBy, values, clone } from 'ramda'
import classNames from 'classnames'
import { ExtensionPoint } from 'render'
import { Button, Spinner, IconDelete } from 'vtex.styleguide'
import ProductPrice from 'vtex.store-components/ProductPrice'
import { MiniCartPropTypes } from '../propTypes'
import { toHttps, changeImageUrlSize } from '../utils/urlHelpers'
import { groupItemsWithParents, isParentItem, isSingleChoiceOption } from '../utils/itemsHelper'

import minicart from '../minicart.css'

/**
 * Minicart content component
 */

/** Four seconds */
const TOAST_TIMEOUT = 4000

class MiniCartContent extends Component {
  static propTypes = {
    /* Set the mini cart content size */
    large: PropTypes.bool,
    /* Internationalization */
    intl: intlShape.isRequired,
    /** Define a function that is executed when the item is clicked */
    actionOnClick: PropTypes.func,
    /* Reused props */
    data: MiniCartPropTypes.orderFormContext,
    labelMiniCartEmpty: MiniCartPropTypes.labelMiniCartEmpty,
    labelButton: MiniCartPropTypes.labelButtonFinishShopping,
    showRemoveButton: MiniCartPropTypes.showRemoveButton,
    showSku: MiniCartPropTypes.showSku,
    enableQuantitySelector: MiniCartPropTypes.enableQuantitySelector,
    maxQuantity: MiniCartPropTypes.maxQuantity,
    showDiscount: MiniCartPropTypes.showDiscount,
  }

  state = { isUpdating: [] }

  sumItemsPrice = items => {
    return items.reduce((sum, { listPrice, quantity }) => sum + listPrice * quantity, 0)
  }

  getGroupedItems = () =>
    values(
      reduceBy(
        (acc, item) =>
          acc ? { ...acc, quantity: acc.quantity + item.quantity } : item,
        undefined,
        item => item.id,
        this.props.data.orderForm.items
      )
    )

  calculateDiscount = (items, totalPrice) =>
    this.sumItemsPrice(items) - totalPrice

  handleClickButton = () => location.assign('/checkout/#/cart')

  handleItemRemoval = async id => {
    this.updateItemLoad(id, true)

    const {
      data: orderFormContext,
      data: { orderForm, updateAndRefetchOrderForm },
      intl,
    } = this.props
    const itemPayload = orderForm.items.find(item => item.id === id)
    const index = orderForm.items.indexOf(itemPayload)
    const updatedItem = [itemPayload].map(item => {
      return {
        id: parseInt(item.id),
        index: index,
        quantity: 0,
        seller: 1,
      }
    })

    try {
      await updateAndRefetchOrderForm({
        variables: {
          orderFormId: orderForm.orderFormId,
          items: updatedItem,
        },
      })
    } catch (error) {
      // TODO improve the way this error is presented.
      orderFormContext.updateToastMessage({
        isSuccess: false,
        text: intl.formatMessage({ id: 'minicart.error-removal' }),
      })

      window.setTimeout(() => {
        orderFormContext.updateToastMessage({ isSuccess: null, text: null })
      }, TOAST_TIMEOUT)
    }
    this.updateItemLoad(id, false)
  }

  updateItemLoad = (itemId, newStatus) => {
    const isUpdating = clone(this.state.isUpdating)
    isUpdating[itemId] = newStatus
    this.setState({ isUpdating })
  }

  onUpdateItems = (id, quantity) => {
    this.updateItemLoad(id, true)
    const {
      data: {
        orderForm,
        updateAndRefetchOrderForm,
      },
    } = this.props

    const items = this.getGroupedItems()
    const itemPayloadGrouped = items.find(item => item.id === id)
    const itemsPayload = orderForm.items.filter(item => item.id === id)
    let itemPayload = itemsPayload[0]
    const index = orderForm.items.indexOf(itemsPayload[0])
    const newQuantity = quantity - (itemPayloadGrouped.quantity - itemPayload.quantity)
    const updatedItems = [
      {
        id: itemPayload.id,
        index,
        quantity: newQuantity,
      },
    ]

    if (newQuantity <= 0) {
      updatedItems[0].quantity = 0
      itemPayload = itemsPayload[1]
      updatedItems.push(
        {
          id: itemPayload.id,
          index: orderForm.items.indexOf(itemPayload),
          quantity: itemPayload.quantity + newQuantity,
        }
      )
    }

    updateAndRefetchOrderForm({
      variables: {
        orderFormId: orderForm.orderFormId,
        items: updatedItems,
      },
    }).then(() => {
      this.updateItemLoad(id, false)
    })
  }

  sumTotalPriceWithAttachs = (addedOptions) => {
    return addedOptions.reduce((acc, option) =>  acc + option.sellingPrice * option.quantity, 0)
  }

  createOptionShapeFromItem = (option) => ({
    ...this.createProductShapeFromItem(option),
    isSingleChoice: isSingleChoiceOption(option, this.props.data.orderForm),
    optionType: option.parentAssemblyBinding.split('_')[1],
  })

  createProductShapeFromItem = item => ({
    productName: item.name,
    linkText: item.detailUrl.replace(/^\//, '').replace(/\/p$/, ''),
    sku: {
      seller: {
        commertialOffer: {
          Price: item.sellingPrice * item.quantity + this.sumTotalPriceWithAttachs(item.addedOptions || []),
          ListPrice: item.ListPrice,
        },
        sellerId: item.seller,
      },
      name: item.skuName,
      itemId: item.id,
      image: {
        imageUrl: changeImageUrlSize(toHttps(item.imageUrl), 240),
      },
    },
    addedOptions: (item.addedOptions || []).map(option => this.createOptionShapeFromItem(option, item)),
    quantity: item.quantity,
  })

  get isUpdating() {
    const { isUpdating } = this.state
    return isUpdating.some(status => status)
  }

  renderWithoutItems = label => (
    <div className={`${minicart.item} pa9 flex items-center justify-center relative bg-base`}>
      <span className="t-body">{label}</span>
    </div>
  )

  renderMiniCartWithItems = (
    orderForm,
    label,
    labelDiscount,
    showDiscount,
    actionOnClick,
    isUpdating,
    large
  ) => {
    const items = groupItemsWithParents(orderForm)
    const MIN_ITEMS_TO_SCROLL = 2

    const classes = classNames(
      `${minicart.content} overflow-x-hidden pa1 overflow-y-auto`,
      {
        [`${minicart.contentSmall} bg-base`]: !large,
        [`${minicart.contentLarge}`]: large,
        'overflow-y-scroll': items.length > MIN_ITEMS_TO_SCROLL && !large,
        'overflow-y-hidden': items.length <= MIN_ITEMS_TO_SCROLL && !large,
      }
    )

    const priceAndDiscountClasses = classNames(
      `${minicart.contentDiscount} w-100 flex justify-end items-center mb3`,
      {
        [`pv3`]: large
      }
    )

    const checkoutButtonClasses = classNames(
      ``,
      {
        [`bb bw4 bw2-m b--transparent`]: large
      }
    )

    const discount = this.calculateDiscount(items, orderForm.value)
    return (
      <Fragment>
        <div className={classes}>
          {items.map(item => (
            <Fragment key={item.id}>
              <div className="relative flex">
                <div className="fr absolute top-0 right-0">
                  {isUpdating[item.id]
                    ? (
                      <div className="ma4">
                        <Spinner size={18} />
                      </div>
                    ) : (
                      <Button icon variation="tertiary" onClick={() => this.handleItemRemoval(item.id)}>
                        <IconDelete size={15} color="silver" />
                      </Button>
                    )
                  }
                </div>
                <ExtensionPoint id="product-summary"
                  showBorders
                  product={this.createProductShapeFromItem(item)}
                  name={item.name}
                  displayMode="inline"
                  showListPrice={false}
                  showBadge={false}
                  showInstallments={false}
                  showLabels={false}
                  actionOnClick={actionOnClick}
                />
              </div>
            </Fragment>
          ))}
        </div>

        <div className={`${minicart.contentFooter} w-100 bg-base pa4 bt b--muted-3 pv5 flex flex-column items-end`}>
          {showDiscount && discount > 0 && (
            <div className={priceAndDiscountClasses}>
              <span className="ttl c-action-primary">{labelDiscount}</span>
              <ProductPrice
                sellingPriceClass='c-action-primary ph2 dib'
                sellingPrice={discount}
                listPrice={discount}
                showLabels={false}
                showListPrice={false}
              />
            </div>
          )}
          <div className={`${minicart.contentPrice} mb3`}>
            {this.isUpdating
              ? (<Spinner size={18} />)
              : (
                <ProductPrice
                  sellingPriceClass='c-muted-1 b ph2 dib'
                  sellingPrice={orderForm.value}
                  listPrice={orderForm.value}
                  showLabels={false}
                  showListPrice={false}
                />
              )
            }
          </div>
          <div className={checkoutButtonClasses}>
            <Button
              variation="primary"
              size="small"
              onClick={this.handleClickButton}
              >
              {label}
            </Button>
          </div>
        </div>
      </Fragment>
    )
  }

  renderLoading = () => (
    <div className={`${minicart.item} pa4 flex items-center justify-center relative bg-base`}>
      <Spinner />
    </div>
  )

  render() {
    const {
      data,
      labelMiniCartEmpty,
      labelButton,
      intl,
      showDiscount,
      actionOnClick,
      large,
    } = this.props
    const { isUpdating } = this.state

    if (!data || data.loading) {
      return this.renderLoading()
    }

    if (!data.orderForm || !data.orderForm.items.length) {
      const label =
        labelMiniCartEmpty || intl.formatMessage({ id: 'minicart-empty' })
      return this.renderWithoutItems(label)
    }

    const label =
      labelButton || intl.formatMessage({ id: 'finish-shopping-button-label' })
    const labelDiscount = intl.formatMessage({
      id: 'minicart-content-footer-discount',
    })

    return this.renderMiniCartWithItems(
      data.orderForm,
      label,
      labelDiscount,
      showDiscount,
      actionOnClick,
      isUpdating,
      large
    )
  }
}

export default injectIntl(MiniCartContent)
