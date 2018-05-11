import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { injectIntl, intlShape } from 'react-intl'
import updateItemsMutation from './graphql/updateItemsMutation.gql'
import orderFormQuery from './graphql/orderFormQuery.gql'
import MiniCartItem from './MiniCartItem'
import Button from '@vtex/styleguide/lib/Button'
import { Price } from '@vtex/product-details'
import Spinner from '@vtex/styleguide/lib/Spinner'
import { MiniCartPropTypes } from './MiniCartPropTypes'

import './global.css'

/**
 * Minicart content component
 */
class MiniCartContent extends Component {
  static propTypes = {
    /* Products in the cart */
    data: MiniCartPropTypes.data,
    /* Mutate function */
    mutate: PropTypes.func.isRequired,
    /* Label to appear when the minicart is empty */
    labelMiniCartEmpty: PropTypes.string,
    /* Label to appear in the finish shopping button */
    labelButton: PropTypes.string,
    /* Show remove item button or not */
    showRemoveButton: PropTypes.bool,
    onUpdateItemsQuantity: PropTypes.func,
    /* Internationalization */
    intl: intlShape.isRequired,
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

  renderWithoutItems = label => (
    <div className="vtex-minicart__item pa4 flex items-center justify-center relative bg-white">
      <span className="f5">{label}</span>
    </div>
  )

  renderMiniCartWithItems = (orderForm, label, showRemoveButton) => (
    <div className="flex flex-column relative" >
      <div className="bg-white">
        <div className="vtex-minicart__content pr4 pl4 overflow-auto">
          {orderForm.items.map(item => (
            <div className="flex flex-row" key={item.id}>
              <MiniCartItem {...item} removeItem={this.onRemoveItem} showRemoveButton={showRemoveButton} />
            </div>
          ))}
        </div>
        <div className="fl pa4">
          <Button primary onClick={this.handleClickButton}>{label}</Button>
        </div>
        <div className="fr pt4 mt2 mr4">
          <Price
            sellingPrice={orderForm.value}
            listPrice={orderForm.value}
            showLabels={false}
            showListPrice={false} />
        </div>
      </div>
    </div >
  )

  renderLoading = () => (
    <div className="vtex-minicart__item pa4 flex items-center justify-center relative bg-white">
      <Spinner />
    </div>
  )

  componentDidMount() {
    this.props.data.refetch().then(() => {
      this.props.onUpdateItemsQuantity(this.props.data.orderForm.items.length)
    })
  }

  render() {
    const { data, labelMiniCartEmpty, labelButton, intl, showRemoveButton } = this.props
    let content
    if (data.loading) {
      content = this.renderLoading()
    } else if (!data.orderForm || !data.orderForm.items.length) {
      const label = labelMiniCartEmpty || intl.formatMessage({ id: 'minicart-empty' })
      content = this.renderWithoutItems(label)
    } else {
      const label = labelButton || intl.formatMessage({ id: 'finish-shopping-button-label' })
      content = this.renderMiniCartWithItems(data.orderForm, label, showRemoveButton)
    }
    return content
  }
}

export default injectIntl(graphql(updateItemsMutation)(MiniCartContent))
