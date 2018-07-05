import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { injectIntl, intlShape } from 'react-intl'
import { reduceBy, values } from 'ramda'
import classNames from 'classnames'

import { Button, Spinner } from 'vtex.styleguide'
import ProductPrice from 'vtex.store-components/ProductPrice'

import updateItemsMutation from '../graphql/updateItemsMutation.gql'
import orderFormQuery from '../graphql/orderFormQuery.gql'

import MiniCartItem from './MiniCartItem'
import { MiniCartPropTypes } from '../propTypes'

/**
 * Minicart content component
 */
class MiniCartContent extends Component {
  static propTypes = {
    /* Set the mini cart content size */
    large: PropTypes.bool,
    /* Function to be called when an item is removed */
    onUpdateItemsQuantity: PropTypes.func,
    /* Mutate function */
    mutate: PropTypes.func.isRequired,
    /* Internationalization */
    intl: intlShape.isRequired,
    /* Reused props */
    data: MiniCartPropTypes.data,
    labelMiniCartEmpty: MiniCartPropTypes.labelMiniCartEmpty,
    labelButton: MiniCartPropTypes.labelButtonFinishShopping,
    showRemoveButton: MiniCartPropTypes.showRemoveButton,
    enableQuantitySelector: MiniCartPropTypes.enableQuantitySelector,
    maxQuantity: MiniCartPropTypes.maxQuantity,
  }

  constructor(props) {
    super(props)
    this.state = { showSpinner: false }
  }

  sumItemsPrice = items => {
    let sum = 0
    items.forEach(item => {
      sum += item.sellingPrice
    })
    return sum
  }

  calculateDiscount = (items, totalPrice) => {
    const liquidPrice = this.sumItemsPrice(items)
    return totalPrice - liquidPrice
  }

  handleClickButton = () => location.assign('/checkout/#/cart')

  onRemoveItem = id => {
    const { mutate, data: { orderForm } } = this.props
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
    mutate({
      variables: {
        orderFormId: orderForm.orderFormId,
        items: updatedItem,
      },
      refetchQueries: [{ query: orderFormQuery }],
    }).then(() => {
      this.props.onUpdateItemsQuantity(this.props.data.orderForm.items.length - 1)
    })
  }

  onUpdateItems = (id, quantity) => {
    this.setState({ showSpinner: true })
    const { mutate, data: { orderForm } } = this.props
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
    mutate({
      variables: {
        orderFormId: orderForm.orderFormId,
        items: updatedItem,
      },
      refetchQueries: [{ query: orderFormQuery }],
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

    const classes = classNames('vtex-minicart__content overflow-x-hidden h-100', {
      'vtex-minicart__content--large': large,
      'vtex-minicart__content--small': !large,
      'overflow-y-scroll': items.length > 3 && !large,
      'overflow-y-hidden': items.length <= 3 && !large,
    })

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
          {large && <div className="vtex-minicart__content-discount w-100 mb4">
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
          }
          <div className="relative">
            <div className="fl">
              <Button variation="primary" size="small" onClick={this.handleClickButton}>{label}</Button>
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
      enableQuantitySelector,
      maxQuantity,
      large,
    } = this.props
    const { showSpinner } = this.state

    console.log(data)

    if (!data) return null

    if (data.loading) {
      return this.renderLoading()
    }

    if (!data.orderForm || !data.orderForm.items.length) {
      const label = labelMiniCartEmpty || intl.formatMessage({ id: 'minicart-empty' })
      return this.renderWithoutItems(label)
    }

    const label = labelButton || intl.formatMessage({ id: 'finish-shopping-button-label' })
    const labelDiscount = intl.formatMessage({ id: 'minicart-content-footer-discount' })

    return this.renderMiniCartWithItems(
      data.orderForm,
      label,
      labelDiscount,
      showRemoveButton,
      enableQuantitySelector,
      maxQuantity,
      showSpinner,
      large
    )
  }
}

export default injectIntl(graphql(updateItemsMutation)(MiniCartContent))
