import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { IconCaretRight } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'

import OutsideClickHandler from 'react-outside-click-handler'

import MiniCart from '../MiniCart'

import '../global.css'

const whiteColor = '#FFFFFF'

/* SideBar component */
class Sidebar extends Component {
  render() {
    const { onBackClick, intl } = this.props

    if (typeof window !== 'undefined') {
      return ReactDOM.createPortal(
        <OutsideClickHandler
          onOutsideClick={onBackClick}
        >
          <div className="vtex-minicart__sidebar fixed top-0 right-0 z-9999 bg-white shadow-2">
            <div
              className="vtex-minicart__sidebar-header pointer flex flex-row items-center pa5"
              onClick={onBackClick}
            >
              <IconCaretRight size={18} color={whiteColor} />
              <div className="mt3 ml4">
                <MiniCart showContent miniCartIconColor={whiteColor} />
              </div>
              <span className="ml4 white b ttu">{intl.formatMessage({ id: 'sidebar-title' })}</span>
            </div>
            <div className="h-100">
              {this.props.children}
            </div>
          </div>
        </OutsideClickHandler>,
        document.body
      )
    }
    return null
  }
}

Sidebar.propTypes = {
  /* Internationalization */
  intl: intlShape.isRequired,
  /* Sidebar content */
  children: PropTypes.object.isRequired,
  /* Function to be called when click in the close sidebar button */
  onBackClick: PropTypes.func,
}

export default injectIntl(Sidebar)
