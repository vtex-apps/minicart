import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { IconCaretLeft } from 'vtex.styleguide'

import MiniCart from '../MiniCart'

import '../global.css'

export default class Sidebar extends Component {
  render() {
    if (typeof window !== 'undefined') {
      return ReactDOM.createPortal(
        <div
          className="vtex-minicart__sidebar fixed top-0 right-0 z-max bg-white mt8 shadow-2">
          <div
            className="vtex-minicart__sidebar-header flex flex-row items-center pa5"
            onClick={this.props.onBackClick}>
            <IconCaretLeft size={18} color="#FFFFFF" />
            <div className="mt3 ml4">
              <MiniCart showContent miniCartIconColor={'#FFFFFF'} />
            </div>
            <span className="ml4 white b ttu">Meu Carrinho</span>
          </div>
          {this.props.children}
        </div>,
        document.body
      )
    }
    return null
  }
}

Sidebar.propTypes = {
  children: PropTypes.object.isRequired,
  onBackClick: PropTypes.func,
}
