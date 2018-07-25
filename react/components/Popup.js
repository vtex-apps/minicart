import React, { Component } from 'react'
import PropTypes from 'prop-types'
import OutsideClickHandler from 'react-outside-click-handler'
import classNames from 'classnames'

/**
 * Pop-up component.
 */
export default class Popup extends Component {
  render() {
    const {
      showDiscount,
      children,
      onOutsideClick,
    } = this.props
    const classes = classNames('mt3 bg-white relative', {
      'vtex-minicart__content-container--footer-small': !showDiscount,
      'vtex-minicart__content-container--footer-large': showDiscount,
    })

    return (
      <OutsideClickHandler onOutsideClick={onOutsideClick}>
        <div className="vtex-minicart__box absolute right-0 z-max flex flex-colunm">
          <div className="shadow-3">
            <div className="vtex-minicart__arrow-up absolute top-0 right-0 shadow-3" />
            <div className={classes}>
              {children}
            </div>
          </div>
        </div>
      </OutsideClickHandler>
    )
  }
}

Popup.propTypes = {
  children: PropTypes.object,
  showDiscount: PropTypes.bool,
  /* Function to be called when click occurs outside the popup */
  onOutsideClick: PropTypes.func,
}
