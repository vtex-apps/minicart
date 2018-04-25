import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import orderFormQuery from './graphql/orderFormQuery.gql'
import Button from '@vtex/styleguide/lib/Button'
import CartIcon from './CartIcon'
import MiniCart from './MiniCart'

class MiniCartButton extends Component {
  constructor(props) {
    super(props)
    this.state = { isMouseOnButton: false, isMouseOnMiniCart: false }
  }

  handleMouseEnterButton = () => {
    this.setState({ isMouseOnButton: true })
  }

  handleMouseLeaveButton = () => {
    this.setState({ isMouseOnButton: false })
  }

  handleMouseEnterCartItems = () => {
    this.setState({ isMouseOnMiniCart: true })
  }

  handleMouseLeaveCartItems = () => {
    this.setState({ isMouseOnMiniCart: false })
  }

  render() {
    const { isMouseOnButton, isMouseOnMiniCart } = this.state
    const { data, labelMiniCartEmpty, labelButtonFinishShopping } = this.props
    return (
      <div className="relative mr6">
        <Button icon
          onMouseEnter={this.handleMouseEnterButton}
          onMouseLeave={this.handleMouseLeaveButton}><CartIcon /></Button>
        {(isMouseOnMiniCart || isMouseOnButton) &&
          <div
            className="absolute top-100 right-0 minicart"
            onMouseLeave={this.handleMouseLeaveCartItems}
            onMouseEnter={this.handleMouseEnterCartItems}>
            <MiniCart
              orderForm={data.orderForm}
              labelMiniCartEmpty={labelMiniCartEmpty}
              labelButton={labelButtonFinishShopping} />
          </div>
        }
      </div>
    )
  }
}

MiniCartButton.propTypes = {
  data: PropTypes.object,
  labelMiniCartEmpty: PropTypes.string.isRequired,
  labelButtonFinishShopping: PropTypes.string.isRequired,
}

export default graphql(orderFormQuery)(
  MiniCartButton
)
