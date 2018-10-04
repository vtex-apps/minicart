import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { IconCaretRight } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import OutsideClickHandler from 'react-outside-click-handler'
import Animation from 'vtex.store-components/Animation'

import MiniCart from '../MiniCart'

const OPEN_SIDEBAR_CLASS = 'vtex-minicart-sidebar-open'

/* SideBar component */
class Sidebar extends Component {
  updateComponent() {
    if (this.props.isOpen) {
      document.body.classList.add(OPEN_SIDEBAR_CLASS)
    } else {
      document.body.classList.remove(OPEN_SIDEBAR_CLASS)
    }
  }

  componentDidMount() {
    this.updateComponent()
  }

  componentDidUpdate() {
    this.updateComponent()
  }

  componentWillUnmount() {
    document.body.classList.remove(OPEN_SIDEBAR_CLASS)
  }

  render() {
    const { isOpen, onOutsideClick, intl } = this.props

    if (typeof document === 'undefined') {
      return null
    }

    return ReactDOM.createPortal(
      <OutsideClickHandler onOutsideClick={onOutsideClick}>
        <Animation
          className="vtex-minicart__sidebar w-100 w-auto-ns h-100 fixed top-0 right-0 z-9999 bg-white shadow-2 flex flex-column"
          isActive={isOpen}
          type="drawerRight"
        >
          <div className="vtex-minicart__sidebar-header pointer flex flex-row items-center pa5 h3 shadow-4 bg-white w-100 z-max">
            <div
              className="mid-gray pa4 flex items-center"
              onClick={onOutsideClick}
            >
              <IconCaretRight size={17} />
            </div>
            <MiniCart
              hideContent
              iconClasses="mid-gray"
              labelClasses="mid-gray"
              iconLabel={intl.formatMessage({ id: 'sidebar-title' })}
            />
          </div>
          {this.props.children}
        </Animation>
      </OutsideClickHandler>,
      document.body
    )
  }
}

Sidebar.propTypes = {
  /* Internationalization */
  intl: intlShape.isRequired,
  /* Set the sideBar visibility */
  isOpen: PropTypes.bool,
  /* Sidebar content */
  children: PropTypes.object.isRequired,
  /* Function to be called when click in the close sidebar button or outside the sidebar */
  onOutsideClick: PropTypes.func,
}

export default injectIntl(Sidebar)
