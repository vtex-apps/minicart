import React, { Component } from 'react'
import orderFormQuery from './graphql/orderFormQuery.gql'
import { graphql } from 'react-apollo'
import Button from '@vtex/styleguide/lib/Button'
import CartIcon from './CartIcon'
import MiniCartContent from './MiniCartContent'
import { MiniCartPropTypes } from './MiniCartPropTypes'

import './global.css'

/**
 * Minicart component
 */
export class MiniCart extends Component {
  static propTypes = MiniCartPropTypes

  static schema = {
    title: 'Mini Cart',
    description: 'The mini cart component',
    type: 'object',
    properties: {
      showRemoveButton: {
        title: 'Show remove item button',
        type: 'boolean',
      },
      labelMiniCartEmpty: {
        title: 'Text to appear when the mini cart is empty',
        type: 'string',
      },
      labelButtonFinishShopping: {
        title: 'Text to appear in the finish shopping button',
        type: 'string',
      },
    },
  }

  constructor(props) {
    super(props)
    this.state = { isMouseOnButton: false, isMouseOnMiniCart: false, quantityItems: 0 }
  }
  componentDidMount() {
    document.addEventListener('item:add', () => {
      const { quantityItems } = this.state
      this.setState({ quantityItems: quantityItems + 1 })
    })
  }

  handleUpdateQuantityItems = quantity => this.setState({ quantityItems: quantity })

  handleClickButton = () => location.assign('/checkout/#/cart')

  handleMouseEnterButton = () => this.setState({ isMouseOnButton: true })

  handleMouseLeaveButton = () => this.setState({ isMouseOnButton: false })

  handleMouseEnterCartItems = () => this.setState({ isMouseOnMiniCart: true })

  handleMouseLeaveCartItems = () => this.setState({ isMouseOnMiniCart: false })

  render() {
    const { isMouseOnButton, isMouseOnMiniCart, quantityItems } = this.state
    const { labelMiniCartEmpty, labelButtonFinishShopping, miniCartIconColor, showRemoveButton } = this.props
    const quantity = (!this.props.data.loading && !quantityItems) ? this.props.data.orderForm.items.length : quantityItems
    return (
      <div className="relative fr" >
        <Button
          icon
          onClick={this.handleClickButton}
          onMouseEnter={this.handleMouseEnterButton}
          onMouseLeave={this.handleMouseLeaveButton}>
          <CartIcon fillColor={miniCartIconColor} />
          <span className="vtex-minicart__bagde mt1 mr1">
            {quantity}
          </span>
        </Button>
        {
          (isMouseOnMiniCart || isMouseOnButton) &&
          <div
            className="vtex-minicart__box absolute right-0 z-max flex flex-colunm"
            onMouseLeave={this.handleMouseLeaveCartItems}
            onMouseEnter={this.handleMouseEnterCartItems}>
            <div className="vtex-minicart__arrow-up absolute top-0 right-0 shadow-3">
            </div>
            <div className="shadow-3 mt3">
              <MiniCartContent
                data={this.props.data}
                onUpdateItemsQuantity={this.handleUpdateQuantityItems}
                showRemoveButton={showRemoveButton}
                labelMiniCartEmpty={labelMiniCartEmpty}
                labelButton={labelButtonFinishShopping} />
            </div>
          </div>
        }
      </div>
    )
  }
}

const options = {
  options: () => ({
    ssr: false,
  }),
}

export default graphql(orderFormQuery, options)(MiniCart)
