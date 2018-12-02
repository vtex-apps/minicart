import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { IconCaretRight } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import OutsideClickHandler from 'react-outside-click-handler'
import Animation from 'vtex.store-components/Animation'
import classNames from 'classnames'

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

    const scrimClasses = classNames('vtex-menu-sidebar__scrim fixed dim bg-base--inverted top-0 left-0 z-9999 w-100 vh-100 o-40', {
      dn: !isOpen,
    })

    return ReactDOM.createPortal(
      <OutsideClickHandler onOutsideClick={onOutsideClick}>
        <div style={{ willChange: 'opacity' }} className={scrimClasses} onClick={onOutsideClick} />

        <Animation
          className="vtex-minicart__sidebar w-80 w-auto-ns h-100 fixed top-0 right-0 z-9999 bg-base shadow-2 flex flex-column"
          isActive={isOpen}
          type="drawerLeft"
        >
          <div className="vtex-minicart__sidebar-header pointer flex flex-row items-center pa5 h3 bg-base w-100 z-max bb b--muted-3 bw1">
            <div
              className="c-muted-1 pa4 flex items-center"
              onClick={onOutsideClick}
            >
              <IconCaretRight size={17} />
            </div>
            <MiniCart
              hideContent
              iconClasses="c-muted-1"
              labelClasses="c-muted-1"
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
