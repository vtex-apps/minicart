import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@vtex/styleguide/lib/Button'
import CartIcon from './CartIcon'
import MiniCart from './MiniCart'

export default class MiniCartButton extends Component {
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
    const { data } = this.props
    return (
      <div className="relative">
        <Button
          onMouseEnter={this.handleMouseEnterButton}
          onMouseLeave={this.handleMouseLeaveButton}><CartIcon /> Hello</Button>
        {(isMouseOnMiniCart || isMouseOnButton) &&
          <div
            className="absolute top-100"
            onMouseLeave={this.handleMouseLeaveCartItems}
            onMouseEnter={this.handleMouseEnterCartItems}>
            <MiniCart data={data} />
          </div>
        }
      </div>
    )
  }
}

MiniCartButton.propTypes = {
  data: PropTypes.object,
}
