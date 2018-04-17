import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import orderFormQuery from '../queries/orderFormQuery.gql'
import updateItemsMutation from '../mutations/updateItemsMutation.gql'
import MiniCartItem from './MiniCartItem'
import Button from '@vtex/styleguide/lib/Button'
import { FormattedNumber } from 'react-intl'

class MiniCart extends Component {
  static propTypes = {
    label: PropTypes.string,
    data: PropTypes.object,
    mutate: PropTypes.func,
  }

  static contextTypes = {
    culture: PropTypes.object,
  }

  handleRemoveItem = ({ target: { id } }) => {
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
    })
  }

  getItemId = detailUrl => {
    const regExp = /\/([^)]+)\//
    return regExp.exec(detailUrl)[1]
  }

  componentWithoutProducts = () => {
    return (
      <div className="tc pv7 pa3 bg-white br2">
        <span>Sua sacola está vazia!</span>
      </div>
    )
  }

  componentWithProducts = (data) => {
    return (
      <div
        className="w-100 tc pa3 bg-white br2 br--bottom shadow-5">
        {data.orderForm.items.map(item => (
          <div className="w-100" key={item.id}>
            <MiniCartItem
              imageUrl={item.imageUrl}
              name={item.name}
              price={item.sellingPrice}
              productId={this.getItemId(item.detailUrl)}
            />
          </div>
        ))}
        <div className="fr mb3">
          <span className="mr2">Total</span>
          <FormattedNumber
            value={data.orderForm.value}
            style="currency"
            currency={this.context.culture.currency}
            minimumFractionDigits={2}
            maximumFractionDigits={2}
          />
        </div>
        <div className="mb4"><Button primary block>Meu carrinho</Button></div>
      </div>
    )
  }

  render() {
    let element
    const { data } = this.props
    if (data.loading) {
      element = null
    } else if (!data.orderForm.items.length) {
      element = this.componentWithoutProducts()
    } else {
      console.log(data)
      element = this.componentWithProducts(data)
    }
    return element
  }
}

export default compose(graphql(orderFormQuery), graphql(updateItemsMutation))(
  MiniCart
)
