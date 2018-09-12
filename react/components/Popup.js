import React, { Component } from 'react'
import PropTypes from 'prop-types'
import OutsideClickHandler from 'react-outside-click-handler'

/**
 * Pop-up component.
 */
export default class Popup extends Component {
  render() {
    const {
      children,
      onOutsideClick,
      buttonOffsetWidth,
    } = this.props

    const boxPositionStyle = {
      right: buttonOffsetWidth && buttonOffsetWidth - 49,
    }

    return (
      <OutsideClickHandler onOutsideClick={onOutsideClick}>
        <div
          className="vtex-minicart__box dn db-ns absolute z-max flex flex-colunm"
          style={boxPositionStyle}
        >
          <div className="shadow-3">
            <div className="vtex-minicart__arrow-up absolute top-0 shadow-3 bg-white h2 w2 pa2 rotate-45" />
            <div className="mt3 bg-white relative flex flex-column">{children}</div>
          </div>
        </div>
      </OutsideClickHandler>
    )
  }
}

Popup.propTypes = {
  children: PropTypes.object,
  buttonOffsetWidth: PropTypes.number,
  /* Function to be called when click occurs outside the popup */
  onOutsideClick: PropTypes.func,
}
