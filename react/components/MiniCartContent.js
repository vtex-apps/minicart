import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { reduceBy, values } from 'ramda'
import classNames from 'classnames'

import { Button, Spinner } from 'vtex.styleguide'
import ProductPrice from 'vtex.store-components/ProductPrice'

import MiniCartItem from './MiniCartItem'
import { MiniCartPropTypes } from '../propTypes'

/**
 * Minicart content component
 */
class MiniCartContent extends Component {
  static propTypes = {
    /* Set the mini cart content size */
    large: PropTypes.bool,
    /* Internationalization */
    intl: intlShape.isRequired,
    /* Reused props */
    data: MiniCartPropTypes.orderFormContext,
    labelMiniCartEmpty: MiniCartPropTypes.labelMiniCartEmpty,
    labelButton: MiniCartPropTypes.labelButtonFinishShopping,
    showRemoveButton: MiniCartPropTypes.showRemoveButton,
    enableQuantitySelector: MiniCartPropTypes.enableQuantitySelector,
    maxQuantity: MiniCartPropTypes.maxQuantity,
    showDiscount: MiniCartPropTypes.showDiscount,
  }

  state = { showSpinner: false }

  sumItemsPrice = items => {
    let sum = 0
    items.forEach(item => {
      sum += item.listPrice * item.quantity
    })
    return sum
  }

  calculateDiscount = (items, totalPrice) =>
    totalPrice - this.sumItemsPrice(items)

  handleClickButton = () => location.assign('/checkout/#/cart')

  onRemoveItem = id => {
    const {
      data: { orderForm, updateNRefetchOrderForm },
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

    updateNRefetchOrderForm({
      variables: {
        orderFormId: orderForm.orderFormId,
        items: updatedItem,
      },
    })
  }

  onUpdateItems = (id, quantity) => {
    this.setState({ showSpinner: true })
    const {
      data: { orderForm, updateNRefetchOrderForm },
    } = this.props
    const itemPayload = orderForm.items.find(item => item.id === id)
    const index = orderForm.items.indexOf(itemPayload)
    const updatedItem = [itemPayload].map(item => {
      return {
        id: parseInt(item.id),
        index: index,
        quantity: quantity,
        seller: 1,
      }
    })

    updateNRefetchOrderForm({
      variables: {
        orderFormId: orderForm.orderFormId,
        items: updatedItem,
      },
    }).then(() => {
      this.setState({
        showSpinner: false,
      })
    })
  }

  renderWithoutItems = label => (
    <div className="vtex-minicart__item pa4 flex items-center justify-center relative bg-white pt9">
      <span className="f5">{label}</span>
    </div>
  )

  renderMiniCartWithItems = (
    orderForm,
    label,
    labelDiscount,
    showRemoveButton,
    showDiscount,
    enableQuantitySelector,
    maxQuantity,
    showSpinner,
    large
  ) => {
    const items = values(
      reduceBy(
        (acc, item) =>
          acc ? { ...acc, quantity: acc.quantity + item.quantity } : item,
        undefined,
        item => item.id,
        orderForm.items
      )
    )

    const classes = classNames(
      'vtex-minicart__content overflow-x-hidden h-100',
      {
        'vtex-minicart__content--small': !large,
        'vtex-minicart__content--large': large,
        'vtex-minicart__content-large--footer-small': large && !showDiscount,
        'vtex-minicart__content-large--footer-large': large && showDiscount,
        'overflow-y-scroll': items.length > 3 && !large,
        'overflow-y-hidden': items.length <= 3 && !large,
      }
    )

    const discount = this.calculateDiscount(orderForm.items, orderForm.value)

    return (
      <Fragment>
        <div className={classes}>
          {items.map(item => (
            <MiniCartItem
              {...item}
              key={item.id}
              large
              removeItem={this.onRemoveItem}
              updateItem={this.onUpdateItems}
              showRemoveButton={showRemoveButton}
              enableQuantitySelector={enableQuantitySelector}
              maxQuantity={maxQuantity}
            />
          ))}
        </div>
        <div className="absolute bottom-0 w-100 bg-white flex flex-column pa4 bt b--silver pt4">
          {showDiscount && (
            <div className="vtex-minicart__content-discount w-100 mb4">
              <span className="ttu b">{labelDiscount}</span>
              <div className="fr">
                <ProductPrice
                  sellingPrice={discount}
                  listPrice={discount}
                  showLabels={false}
                  showListPrice={false}
                />
              </div>
            </div>
          )}
          <div className="relative">
            <div className="fl">
              <Button
                variation="primary"
                size="small"
                onClick={this.handleClickButton}
              >
                {label}
              </Button>
            </div>
            <div className="absolute right-0 mt3 flex flex-row">
              {showSpinner && <Spinner size={18} />}
              <ProductPrice
                sellingPrice={orderForm.value}
                listPrice={orderForm.value}
                showLabels={false}
                showListPrice={false}
              />
            </div>
          </div>
        </div>
      </Fragment>
    )
  }

  renderLoading = () => (
    <div className="vtex-minicart__item pa4 flex items-center justify-center relative bg-white">
      <Spinner />
    </div>
  )

  render() {
    const {
      data,
      labelMiniCartEmpty,
      labelButton,
      intl,
      showRemoveButton,
      showDiscount,
      enableQuantitySelector,
      maxQuantity,
      large,
    } = this.props
    const { showSpinner } = this.state

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
      showRemoveButton,
      showDiscount,
      enableQuantitySelector,
      maxQuantity,
      showSpinner,
      large
    )
  }
}

export default injectIntl(MiniCartContent)
