import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import orderFormQuery from './graphql/orderFormQuery.gql'
import PropTypes from 'prop-types'
import MiniCartItem from './MiniCartItem'
import Button from '@vtex/styleguide/lib/Button'
import { Price } from '@vtex/product-details'
import Spinner from '@vtex/styleguide/lib/Spinner'

class MiniCart extends Component {
  onRemoveItem = () => {
    console.log('Remove item')
  }

  renderWithoutProducts = () => {
    return (
      <div className="minicart-item pa4 shadow-3">
        <span className="top-50">Sua sacola está vazia!</span>
      </div>
    )
  }

  renderMiniCartWithItems = (data) => {
    return (
      <div className="pa4 shadow-3">
        {data.orderForm.items.map(item => (
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
          <Button primary>Fechar Pedidos</Button>
          <div className="fr mt2 mr5">
            <Price
              sellingPrice={data.orderForm.value}
              listPrice={data.orderForm.value}
              showLabels={false}
              showListPrice={false} />
          </div>
        </div>
      </div>
    )
  }

  renderLoading = () => {
    return (
      <div className="minicart-item shadow-3 pa4">
        <Spinner />
      </div>
    )
  }

  render() {
    const { data } = this.props
    let content
    console.log(data)
    if (data.loading) {
      content = this.renderLoading()
    } else if (!data.orderForm.length) {
      content = this.renderWithoutProducts()
    } else {
      content = this.renderMiniCartWithItems(data)
    }
    return content
  }
}

MiniCart.propTypes = {
  data: PropTypes.object,
}

export default compose(graphql(orderFormQuery))(
  MiniCart
)
