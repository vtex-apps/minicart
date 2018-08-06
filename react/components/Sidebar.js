import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { IconCaretRight } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import OutsideClickHandler from 'react-outside-click-handler'
import { Transition } from 'react-spring'

import MiniCart from '../MiniCart'

const WHITE_COLOR = '#FFFFFF'

/* SideBar component */
class Sidebar extends Component {
  componentDidMount() {
    document.body.classList.add('vtex-minicart-sidebar-open')
  }

  componentWillUnmount() {
    document.body.classList.remove('vtex-minicart-sidebar-open')
  }

  renderChildren = styles => {
    const { onOutsideClick, intl } = this.props

    return (
      <OutsideClickHandler onOutsideClick={onOutsideClick}>
        <div className="vtex-minicart__sidebar fixed top-0 right-0 z-9999 bg-white shadow-2 flex flex-column"
          style={styles}>
          <div
            className="vtex-minicart__sidebar-header pointer flex flex-row items-center pa5"
            onClick={onOutsideClick}
          >
            <IconCaretRight size={18} color={WHITE_COLOR} />
            <div className="mt3 ml4">
              <MiniCart hideContent miniCartIconColor={WHITE_COLOR} />
            </div>
            <span className="ml4 white b ttu">{intl.formatMessage({ id: 'sidebar-title' })}</span>
          </div>
          {this.props.children}
        </div>
      </OutsideClickHandler>
    )
  }

  render() {
    const { isOpen } = this.props

    if (typeof document !== 'undefined') {
      return ReactDOM.createPortal(
        <Transition
          keys={isOpen ? ['children'] : []}
          from={{ transform: 'translateX(100%)' }}
          enter={{ transform: 'translateX(0%)' }}
          leave={{ transform: 'translateX(100%)' }}
        >
          {isOpen ? [this.renderChildren] : []}
        </Transition>,
        document.body
      )
    }
    return null
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
