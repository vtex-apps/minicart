import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MiniCartItem from './MiniCartItem'
import Button from '@vtex/styleguide/lib/Button'
import { Price } from '@vtex/product-details'

class MiniCart extends Component {
  onRemoveItem = () => {
    console.log('Remove item')
  }

  renderWithoutProducts = (label) => {
    return (
      <div className="minicart-item pa4 shadow-4 flex items-center justify-center">
        <span className="f5">{label}</span>
      </div>
    )
  }

  renderMiniCartWithItems = (orderForm, label) => {
    return (
      <div className="pa4 shadow-3">
        {orderForm.items.map(item => (
          <div className="flex flex-row" key={item.id}>
            <MiniCartItem
              imageUrl={item.imageUrl}
              name={item.name}
              sellingPrice={item.sellingPrice}
              listPrice={item.listPrice}
              skuName={item.skuName}
              callback={this.onRemoveItem} />
            <hr />
          </div>
        ))}
        <div className="relative">
          <Button primary>{label}</Button>
          <div className="fr mt2 mr5">
            <Price
              sellingPrice={orderForm.value}
              listPrice={orderForm.value}
              showLabels={false}
              showListPrice={false} />
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { orderForm, labelMiniCartEmpty, labelButton } = this.props
    let content
    console.log(orderForm)
    if (!orderForm.length) {
      content = this.renderWithoutProducts(labelMiniCartEmpty)
    } else {
      content = this.renderMiniCartWithItems(orderForm, labelButton)
    }
    return content
  }
}

MiniCart.propTypes = {
  orderForm: PropTypes.object.isRequired,
  labelMiniCartEmpty: PropTypes.string.isRequired,
  labelButton: PropTypes.string.isRequired,
}

export default MiniCart

