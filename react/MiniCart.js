import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@vtex/styleguide/lib/Button'
import CartIcon from './CartIcon'
import MiniCartContent from './MiniCartContent'
import './global.css'

/**
 * Minicart component
 */
export default class MiniCart extends Component {
  static propTypes = {
    /* Label to appear when the minicart is empty */
    labelMiniCartEmpty: PropTypes.string,
    /* Finish shopping button label */
    labelButtonFinishShopping: PropTypes.string,
    /* Mini cart icon color */
    miniCartIconColor: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = { isMouseOnButton: false, isMouseOnMiniCart: false }
  }

  handleClickButton = () => location.assign('/checkout/#/cart')

  handleMouseEnterButton = () => this.setState({ isMouseOnButton: true })

  handleMouseLeaveButton = () => this.setState({ isMouseOnButton: false })

  handleMouseEnterCartItems = () => this.setState({ isMouseOnMiniCart: true })

  handleMouseLeaveCartItems = () => this.setState({ isMouseOnMiniCart: false })

  render() {
    const { isMouseOnButton, isMouseOnMiniCart } = this.state
    const { labelMiniCartEmpty, labelButtonFinishShopping, miniCartIconColor } = this.props
    return (
      <div className="relative fr">
        <Button
          icon
          onClick={this.handleClickButton}
          onMouseEnter={this.handleMouseEnterButton}
          onMouseLeave={this.handleMouseLeaveButton}>
          <CartIcon fillColor={miniCartIconColor} />
        </Button>
        {(isMouseOnMiniCart || isMouseOnButton) &&
          <div
            className="absolute right-0 vtex-minicart__box bg-white z-max"
            onMouseLeave={this.handleMouseLeaveCartItems}
            onMouseEnter={this.handleMouseEnterCartItems}>
            <MiniCartContent
              labelMiniCartEmpty={labelMiniCartEmpty}
              labelButton={labelButtonFinishShopping} />
          </div>
        }
      </div>
    )
  }
}
