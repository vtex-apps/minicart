import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { injectIntl, intlShape } from 'react-intl'
import { reduceBy, values } from 'ramda'

import { Button, Spinner } from 'vtex.styleguide'
import ProductPrice from 'vtex.store-components/ProductPrice'

import updateItemsMutation from '../graphql/updateItemsMutation.gql'
import orderFormQuery from '../graphql/orderFormQuery.gql'

import MiniCartItem from './MiniCartItem'
import { MiniCartPropTypes } from '../propTypes'

import '../global.css'

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
    <div className="vtex-minicart__item pa4 flex items-center justify-center relative bg-white">
      <span className="f5">{label}</span>
    </div>
  )

  renderMiniCartWithItems = (
    orderForm,
    label,
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
    return (
      <div className="flex flex-column relative" >
        <div className="bg-white">
          <div
            className={`
            ${large ? 'vtex-minicart__content-large' : 'vtex-minicart__content-small'}
            ${(items.length > 3 && !large) ? 'overflow-y-scroll' : 'overflow-y-hidden'} ph4 overflow-x-hidden`}>
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
          <div className="fl pa4">
            <Button variation="primary" size="small" onClick={this.handleClickButton}>{label}</Button>
          </div>
          <div className="flex flex-row fr pt4 mt2 mr4">
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

    if (data.loading) {
      return this.renderLoading()
    }

    if (!data.orderForm || !data.orderForm.items.length) {
      const label = labelMiniCartEmpty || intl.formatMessage({ id: 'minicart-empty' })
      return this.renderWithoutItems(label)
    }

    const label = labelButton || intl.formatMessage({ id: 'finish-shopping-button-label' })

    return this.renderMiniCartWithItems(
      data.orderForm,
      label,
      showRemoveButton,
      enableQuantitySelector,
      maxQuantity,
      showSpinner,
      large
    )
  }
}

export default injectIntl(graphql(updateItemsMutation)(MiniCartContent))
