import React, { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * Cart Icon component in svg
 */
export default class CartIcon extends Component {
  static propTypes = {
    /* Percentage size of the icon */
    size: PropTypes.number,
    /* Fill color for the icon */
    fillColor: PropTypes.string,
  }

  static defaultProps = {
    size: 20,
    fillColor: '#000000',
  }

  render() {
    const { size, fillColor } = this.props
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size}>
        <g className="nc-icon-wrapper" fill={fillColor}>
          <circle cx="6.5" cy="21.5" r="2.5" />
          <circle cx="19.5" cy="21.5" r="2.5" />
          <path d="M20,17H6c-0.501,0-0.925-0.371-0.991-0.868L3.125,2H0V0h4c0.501,0,0.925,0.371,0.991,0.868L5.542,5H23 c0.316,0,0.614,0.149,0.802,0.403c0.189,0.254,0.247,0.582,0.156,0.884l-3,10C20.831,16.71,20.441,17,20,17z" />
        </g>
      </svg>
    )
  }
}

