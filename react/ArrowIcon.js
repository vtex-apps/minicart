import React, { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * Arraw Icon component in svg
 */
export default class ArrowIcon extends Component {
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
      <svg width={size} height={size} viewBox="0 0 29 29" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0H0V20L20 0Z" transform="translate(14.8491) rotate(45)" fill={fillColor} />
      </svg>
    )
  }
}

