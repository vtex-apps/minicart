import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { injectIntl, intlShape } from 'react-intl'
import {
  equals,
  reduceBy,
  values,
  clone,
  last,
  split,
  find,
  propEq,
} from 'ramda'
import classNames from 'classnames'

import { ExtensionPoint } from 'vtex.render-runtime'
import { Button, Spinner } from 'vtex.styleguide'
import { IconDelete } from 'vtex.dreamstore-icons'

import { MiniCartPropTypes } from '../propTypes'
import { toHttps, changeImageUrlSize } from '../utils/urlHelpers'
import {
  groupItemsWithParents,
  getOptionChoiceType,
} from '../utils/itemsHelper'

import minicart from '../minicart.css'
import MiniCartFooter from './MiniCartFooter'

/**
 * Minicart content component
 */

/** Four seconds */
// const TOAST_TIMEOUT = 4000

class MiniCartContent extends Component {
  static propTypes = {
    /* Set the mini cart content size */
    isSizeLarge: PropTypes.bool,
    /* Internationalization */
    intl: intlShape.isRequired,
    /** Define a function that is executed when the item is clicked */
    onClickAction: PropTypes.func,
    /* Reused props */
    data: MiniCartPropTypes.orderFormContext,
    labelMiniCartEmpty: MiniCartPropTypes.labelMiniCartEmpty,
    labelButton: MiniCartPropTypes.labelButtonFinishShopping,
    showRemoveButton: MiniCartPropTypes.showRemoveButton,
    showSku: MiniCartPropTypes.showSku,
    enableQuantitySelector: MiniCartPropTypes.enableQuantitySelector,
    maxQuantity: MiniCartPropTypes.maxQuantity,
    showDiscount: MiniCartPropTypes.showDiscount,
    showShippingCost: MiniCartPropTypes.showShippingCost,

    /* Update Items mutation */
    updateItems: PropTypes.func.isRequired,
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
        this.props.data.orderForm.items
      )
    )

  getShippingCost = orderForm => {
    const totalizer = find(propEq('id', 'Shipping'))(orderForm.totalizers)
    return totalizer && totalizer.value / 100
  }

  calculateDiscount = (items, totalPrice) =>
    this.sumItemsPrice(items) - totalPrice

  handleItemRemoval = async id => {
    const {
      data: { orderForm, refetch },
      updateItems,
    } = this.props
    const itemPayload = orderForm.items.find(item => item.id === id)
    const index = orderForm.items.indexOf(itemPayload)
    const updatedItem = [itemPayload].map(({ id, ...rest }) => ({
      id,
      ...rest,
      index,
      quantity: 0,
      seller: 1,
    }))

    try {
      await updateItems(updatedItem)
    } catch (error) {
      // TODO: Toast message
      console.error(error)
      await refetch()
    }
  }

  updateItemLoad = (itemId, newStatus) => {
    const isUpdating = clone(this.state.isUpdating)
    isUpdating[itemId] = newStatus
    this.setState({ isUpdating })
  }

  sumOptionsPrice = (addedOptions = []) =>
    addedOptions.reduce(
      (acc, option) => acc + option.sellingPrice * option.quantity,
      0
    )

  createProductShapeFromOption = option => ({
    ...this.createProductShapeFromItem(option),
    choiceType: getOptionChoiceType(option, this.props.data.orderForm),
    optionType:
      option.parentAssemblyBinding &&
      last(split('_', option.parentAssemblyBinding)),
  })

  createProductShapeFromItem = item => ({
    productName: item.name,
    linkText: item.detailUrl.replace(/^\//, '').replace(/\/p$/, ''),
    sku: {
      seller: {
        commertialOffer: {
          Price:
            item.sellingPrice * item.quantity +
            this.sumOptionsPrice(item.addedOptions),
          ListPrice: item.ListPrice,
        },
      },
      name: item.skuName,
      itemId: item.id,
      image: {
        imageUrl: changeImageUrlSize(toHttps(item.imageUrl), 240),
      },
    },
    addedOptions: (item.addedOptions || []).map(option =>
      this.createProductShapeFromOption(option)
    ),
    quantity: item.quantity,
  })

  get isUpdating() {
    const { isUpdating } = this.state
    const {
      orderForm: { items },
    } = this.props.data
    return (
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
    label,
    labelDiscount,
    showDiscount,
    onClickAction,
    isUpdating,
    isSizeLarge,
    showShippingCost
  ) => {
    const items = groupItemsWithParents(orderForm)
    const MIN_ITEMS_TO_SCROLL = 2

    const classes = classNames(
      `${minicart.content} overflow-x-hidden pa1 overflow-y-auto`,
      {
        [`${minicart.contentSmall} bg-base`]: !isSizeLarge,
        [`${minicart.contentLarge}`]: isSizeLarge,
        'overflow-y-scroll': items.length > MIN_ITEMS_TO_SCROLL && !isSizeLarge,
        'overflow-y-hidden':
          items.length <= MIN_ITEMS_TO_SCROLL && !isSizeLarge,
      }
    )

    return (
      <Fragment>
        <div className={classes}>
          {items
            .filter(({ quantity }) => !!quantity)
            .map(item => (
              <Fragment key={item.id}>
                <div className="relative flex">
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
                    displayMode="inline"
                    showListPrice={false}
                    showBadge={false}
                    showInstallments={false}
                    showLabels={false}
                    onClickAction={onClickAction}
                  />
                </div>
              </Fragment>
            ))}
        </div>
        <MiniCartFooter
          shippingCost={this.getShippingCost(orderForm)}
          isUpdating={this.isUpdating}
          totalValue={orderForm.value}
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
      data,
      labelMiniCartEmpty,
      labelButton,
      intl,
      showDiscount,
      onClickAction,
      isSizeLarge,
      showShippingCost,
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
      onClickAction,
      isUpdating,
      isSizeLarge,
      showShippingCost
    )
  }
}

const withLinkStateUpdateItemsMutation = graphql(
  gql`
    mutation updateItems($items: [MinicartItem]) {
      updateItems(items: $items) @client
    }
  `,
  {
    name: 'updateItems',
    props: ({ updateItems }) => ({
      updateItems: items => updateItems({ variables: { items } }),
    }),
  }
)

export default compose(
  injectIntl,
  withLinkStateUpdateItemsMutation
)(MiniCartContent)
