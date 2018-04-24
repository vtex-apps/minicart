import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MiniCartItem from './MiniCartItem'
import Button from '@vtex/styleguide/lib/Button'
import { Price } from '@vtex/product-details'

export default class MiniCart extends Component {
  render() {
    const { data } = this.props
    console.log(data)
    console.log(data.value)
    if (data.loading) {
      return null
    }
    return (
      <div className="pa4 shadow-3">
        {data.orderForm.items.map(item => (
          <div className="flex flex-row" key={item.id}>
            <MiniCartItem
              imageUrl={item.imageUrl}
              name={item.name}
              price={item.sellingPrice}
              skuName={item.skuName} />
            <hr />
          </div>
        ))}
        <div className="relative">
          <Button primary>Fechar Pedidos</Button>
          <Price sellingPrice={data.orderForm.value} showLabels={false} showListPrice={false} />
        </div>
      </div>
    )
  }
}

MiniCart.propTypes = {
  data: PropTypes.object,
}
