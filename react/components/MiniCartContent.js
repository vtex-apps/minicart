import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { injectIntl, intlShape } from 'react-intl'
import { reduceBy, values, clone, find, propEq } from 'ramda'
import classNames from 'classnames'

import { ExtensionPoint } from 'vtex.render-runtime'
import { Button, Spinner } from 'vtex.styleguide'
import { IconDelete } from 'vtex.store-icons'

import { MiniCartPropTypes } from '../propTypes'
import { toHttps, changeImageUrlSize } from '../utils/urlHelpers'

import { updateItemsMutation } from '../localState/mutations'
import minicart from '../minicart.css'
import MiniCartFooter from './MiniCartFooter'

/**
 * Minicart content component
 */

class MiniCartContent extends Component {
  static propTypes = {
    /* Set the mini cart content size */
    isSizeLarge: PropTypes.bool,
    /* Internationalization */
    intl: intlShape.isRequired,
    /** Define a function that is executed when the item is clicked */
    onClickAction: PropTypes.func,
    /* Update Items mutation */
    updateItems: PropTypes.func.isRequired,
    /* Determines if the orderform is updating */
    updatingOrderForm: PropTypes.bool,
    /* Reused props */
    orderForm: PropTypes.object,
    loading: PropTypes.bool,
    labelMiniCartEmpty: MiniCartPropTypes.labelMiniCartEmpty,
    labelButton: MiniCartPropTypes.labelButtonFinishShopping,
    showDiscount: MiniCartPropTypes.showDiscount,
    showShippingCost: MiniCartPropTypes.showShippingCost,
    itemsToShow: PropTypes.arrayOf(PropTypes.object),
  }

  state = { isUpdating: [] }

  sumItemsPrice = items =>
    items.reduce(
      (sum, { listPrice, quantity }) => sum + listPrice * quantity,
      0
    )

  getGroupedItems = () =>
    values(
      reduceBy(
        (acc, item) =>
          acc ? { ...acc, quantity: acc.quantity + item.quantity } : item,
        undefined,
        item => item.id,
        this.props.orderForm.items
      )
    )

  getShippingCost = orderForm => {
    const totalizer = find(propEq('id', 'Shipping'))(orderForm.totalizers)
    return totalizer && totalizer.value / 100
  }

  calculateDiscount = (items, totalPrice) =>
    this.sumItemsPrice(items) - totalPrice

  handleItemRemoval = async id => {
    const { orderForm, updateItems } = this.props
    const itemPayload = orderForm.items.find(item => item.id === id)
    const index = orderForm.items.indexOf(itemPayload)
    const updatedItems = [itemPayload].map(item => ({
      ...item,
      index,
      quantity: 0,
      seller: 1,
    }))

    try {
      await updateItems(updatedItems)
    } catch (error) {
      // TODO: Toast error message
      console.error(error)
    }
  }

  updateItemLoad = (itemId, newStatus) => {
    const isUpdating = clone(this.state.isUpdating)
    isUpdating[itemId] = newStatus
    this.setState({ isUpdating })
  }

  sumOptionsSellingPrice = ({ added = [] }) => {
    return added.reduce(
      (acc, option) => acc + option.item.sellingPrice * option.item.quantity,
      0
    )
  }

  createProductShapeFromItem = item => ({
    productName: item.name,
    linkText: item.detailUrl.replace(/^\//, '').replace(/\/p$/, ''),
    sku: {
      seller: {
        commertialOffer: {
          Price:
            item.sellingPrice * item.quantity +
            this.sumOptionsSellingPrice(item.assemblyOptions || {}),
          ListPrice: item.listPrice,
        },
        sellerId: item.seller,
      },
      name: item.skuName,
      itemId: item.id,
      image: {
        imageUrl: changeImageUrlSize(toHttps(item.imageUrl), 240),
      },
    },
    assemblyOptions: item.assemblyOptions,
    quantity: item.quantity,
  })

  get isUpdating() {
    const { isUpdating } = this.state
    const {
      orderForm: { items },
      updatingOrderForm,
    } = this.props
    return (
      updatingOrderForm ||
      items.some(item => !!item.seller || item.quantity === 0) ||
      isUpdating.some(status => status)
    )
  }

  renderWithoutItems = label => (
    <div
      className={`${
        minicart.item
      } pa9 flex items-center justify-center relative bg-base`}
    >
      <span className="t-body">{label}</span>
    </div>
  )

  renderMiniCartWithItems = (
    orderForm,
    itemsToShow,
    label,
    labelDiscount,
    showDiscount,
    onClickAction,
    isUpdating,
    isSizeLarge,
    showShippingCost
  ) => {
    const MIN_ITEMS_TO_SCROLL = 2

    const classes = classNames(`${minicart.content} overflow-x-hidden pa1`, {
      [`${minicart.contentSmall} bg-base`]: !isSizeLarge,
      [`${minicart.contentLarge}`]: isSizeLarge,
      'overflow-y-scroll':
        itemsToShow.length > MIN_ITEMS_TO_SCROLL && !isSizeLarge,
      'overflow-y-hidden':
        itemsToShow.length <= MIN_ITEMS_TO_SCROLL && !isSizeLarge,
    })

    return (
      <Fragment>
        <div className={classes}>
          {itemsToShow.map(item => (
            <Fragment key={item.id}>
              <section className="relative flex">
                <div className="fr absolute top-0 right-0">
                  {isUpdating[item.id] ? (
                    <div className="ma4">
                      <Spinner size={18} />
                    </div>
                  ) : (
                    <Button
                      icon
                      variation="tertiary"
                      onClick={() => this.handleItemRemoval(item.id)}
                    >
                      <IconDelete size={15} activeClassName="c-muted-2" />
                    </Button>
                  )}
                </div>
                <ExtensionPoint
                  id="product-summary"
                  showBorders
                  product={this.createProductShapeFromItem(item)}
                  name={item.name}
                  displayMode="inlinePrice"
                  showListPrice={false}
                  showBadge={false}
                  showInstallments={false}
                  showLabels={false}
                  actionOnClick={onClickAction}
                />
              </section>
            </Fragment>
          ))}
        </div>
        <MiniCartFooter
          shippingCost={this.getShippingCost(orderForm)}
          isUpdating={this.isUpdating}
          totalValue={orderForm.value}
          discount={this.calculateDiscount(orderForm.items, orderForm.value)}
          buttonLabel={label}
          isSizeLarge={isSizeLarge}
          labelDiscount={labelDiscount}
          showDiscount={showDiscount}
          showShippingCost={showShippingCost}
        />
      </Fragment>
    )
  }

  renderLoading = () => (
    <div
      className={`${
        minicart.item
      } pa4 flex items-center justify-center relative bg-base`}
    >
      <Spinner />
    </div>
  )

  render() {
    const {
      itemsToShow,
      labelMiniCartEmpty,
      labelButton,
      intl,
      showDiscount,
      onClickAction,
      isSizeLarge,
      showShippingCost,
      orderForm,
      loading,
    } = this.props
    const { isUpdating } = this.state

    if (loading) {
      return this.renderLoading()
    }

    if (!orderForm || !itemsToShow.length) {
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
      orderForm,
      itemsToShow,
      label,
      labelDiscount,
      showDiscount,
      onClickAction,
      isUpdating,
      isSizeLarge,
      showShippingCost
    )
  }
}

const withLinkStateUpdateItemsMutation = graphql(updateItemsMutation, {
  name: 'updateItems',
  props: ({ updateItems }) => ({
    updateItems: items => updateItems({ variables: { items } }),
  }),
})

export default compose(
  injectIntl,
  withLinkStateUpdateItemsMutation
)(MiniCartContent)
