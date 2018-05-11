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
    /* Show the remove item button or not */
    showRemoveButton: PropTypes.bool.isRequired,
  }

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
        default: 'Your bag is empty!',
      },
      labelButtonFinishShopping: {
        title: 'Text to appear in the finish shopping button',
        type: 'string',
        default: 'Close request',
      },
    },
  }

  constructor(props) {
    super(props)
    this.state = { isMouseOnButton: false, isMouseOnMiniCart: false }
  }
  componentDidMount() {
    document.addEventListener('item:adicionado', () => {
      // TODO - UPDATE BADGE COUNT
    })
  }

  handleClickButton = () => location.assign('/checkout/#/cart')

  handleMouseEnterButton = () => this.setState({ isMouseOnButton: true })

  handleMouseLeaveButton = () => this.setState({ isMouseOnButton: false })

  handleMouseEnterCartItems = () => this.setState({ isMouseOnMiniCart: true })

  handleMouseLeaveCartItems = () => this.setState({ isMouseOnMiniCart: false })

  render() {
    const { isMouseOnButton, isMouseOnMiniCart } = this.state
    const { labelMiniCartEmpty, labelButtonFinishShopping, miniCartIconColor, showRemoveButton } = this.props
    return (
      <div className="relative fr" >
        <Button
          icon
          onClick={this.handleClickButton}
          onMouseEnter={this.handleMouseEnterButton}
          onMouseLeave={this.handleMouseLeaveButton}>
          <CartIcon fillColor={miniCartIconColor} />
        </Button>
        {
          (isMouseOnMiniCart || isMouseOnButton) &&
          <div
            className="vtex-minicart__box absolute right-0 bg-white z-max"
            onMouseLeave={this.handleMouseLeaveCartItems}
            onMouseEnter={this.handleMouseEnterCartItems}>
            <MiniCartContent
              showRemoveButton={showRemoveButton}
              labelMiniCartEmpty={labelMiniCartEmpty}
              labelButton={labelButtonFinishShopping} />
          </div>
        }
      </div>
    )
  }
}
