import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import orderFormQuery from './graphql/orderFormQuery.gql'
import MiniCartItem from './MiniCartItem'
import Button from '@vtex/styleguide/lib/Button'
import { Price } from '@vtex/product-details'
import Spinner from '@vtex/styleguide/lib/Spinner'
import './global.css'

/**
 * Minicart component
 */
class MiniCart extends Component {
  handleClickButton = () => location.assign('/checkout/#/cart')

  renderWithoutProducts = (label) => (
    <div className="vtex-minicart__item pa4 shadow-4 flex items-center justify-center">
      <span className="f5">{label}</span>
    </div>
  )

  renderMiniCartWithItems = (orderForm, label) => (
    <div className="flex flex-column">
      <div className="vtex-minicart__arrow-up self-end mr3 pr1"></div>
      <div className="shadow-3">
        <div className="pa4 overflow-auto vtex-minicart__content">
          {orderForm.items.map(item => (
            <div className="flex flex-row" key={item.id}>
              <MiniCartItem {...item} />
            </div>
          ))}
        </div>
        <div className="relative pr4 pl4 pb4">
          <Button primary onClick={this.handleClickButton}>{label}</Button>
          <div className="fr mt2">
            <Price
              sellingPrice={orderForm.value}
              listPrice={orderForm.value}
              showLabels={false}
              showListPrice={false} />
          </div>
        </div>
      </div>
    </div >
  )

  renderLoading = () => (
    <div className="vtex-minicart__item shadow-3 pa4 flex items-center justify-center">
      <Spinner />
    </div>
  )

  render() {
    const { data, labelMiniCartEmpty, labelButton } = this.props
    let content
    if (data.loading) {
      content = this.renderLoading()
    } else if (!data.orderForm.length) {
      content = this.renderWithoutProducts(labelMiniCartEmpty)
    } else {
      content = this.renderMiniCartWithItems(data.orderForm, labelButton)
    }
    return content
  }
}

MiniCart.propTypes = {
  /* Products in the cart */
  data: PropTypes.object,
  /* Label to appear when the minicart is empty */
  labelMiniCartEmpty: PropTypes.string.isRequired,
  /* Label to appear in the finish shopping button */
  labelButton: PropTypes.string.isRequired,
}

export default graphql(orderFormQuery)(MiniCart)
