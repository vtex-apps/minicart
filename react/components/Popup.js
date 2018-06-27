import React, { Component } from 'react'
import PropTypes from 'prop-types'

/* A Pop-up component */
export default class Popup extends Component {
  render() {
    const { children, onMouseEnter, onMouseLeave } = this.props
    return (
      <div
        className="vtex-minicart__box absolute right-0 z-max flex flex-colunm"
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}>
        <div className="vtex-minicart__arrow-up absolute top-0 right-0 shadow-3">
        </div>
        <div className="shadow-3 mt3">
          {children}
        </div>
      </div>

    )
  }
}

Popup.propTypes = {
  /* View that will appear inside the pop up */
  children: PropTypes.object.isRequired,
  /* Function to be called when the mouse enter the pop up */
  onMouseEnter: PropTypes.func.isRequired,
  /* Function to be called when the mouse leave the pop up */
  onMouseLeave: PropTypes.func.isRequired,
}
