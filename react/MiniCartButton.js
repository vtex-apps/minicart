import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@vtex/styleguide/lib/Button'
import CartIcon from './CartIcon'
import MiniCart from './MiniCart'

/**
 * Minicart button component
 */
export default class MiniCartButton extends Component {
  constructor(props) {
    super(props)
    this.state = { isMouseOnButton: false, isMouseOnMiniCart: false }
  }

  handleClickButton = () => location.assign('/checkout/#/cart')

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
    const { labelMiniCartEmpty, labelButtonFinishShopping } = this.props
    return (
      <div>
        <Button icon
          onClick={this.handleClickButton}
          onMouseEnter={this.handleMouseEnterButton}
          onMouseLeave={this.handleMouseLeaveButton}><CartIcon /></Button>
        {(isMouseOnMiniCart || isMouseOnButton) &&
          <div
            className="absolute top-100 right-0 minicart"
            onMouseLeave={this.handleMouseLeaveCartItems}
            onMouseEnter={this.handleMouseEnterCartItems}>
            <MiniCart
              labelMiniCartEmpty={labelMiniCartEmpty}
              labelButton={labelButtonFinishShopping} />
          </div>
        }
      </div>
    )
  }
}

MiniCartButton.propTypes = {
  /* Label to appear when the minicart is empty */
  labelMiniCartEmpty: PropTypes.string.isRequired,
  /* Finish shopping button label */
  labelButtonFinishShopping: PropTypes.string.isRequired,
}
