import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@vtex/styleguide/lib/Button'
import CartIcon from './CartIcon'
import MiniCart from './MiniCart'

export default class MiniCartButton extends Component {
  constructor(props) {
    super(props)
    this.state = { showMiniCartItems: false }
  }
    handleMouseEnter = () => {
      this.setState({ showMiniCartItems: true })
    }

    handleMouseOut = () => {
      this.setState({ showMiniCartItems: false })
    }

    render() {
      const { showMiniCartItems } = this.state
      const { data } = this.props
      return (
        <div className="relative">
          <Button onMouseEnter={this.handleMouseEnter}><CartIcon /></Button>
          {showMiniCartItems && <div className="absolute top-100" onMouseLeave={this.handleMouseOut}><MiniCart data={data} /></div>}
        </div>
      )
    }
}

MiniCartButton.propTypes = {
  data: PropTypes.object,
}
