import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { IconCaretLeft } from 'vtex.styleguide'

import MiniCart from '../MiniCart'

// import { CaretLeft } from 'vtex.styleguide'

import '../global.css'

export default class Sidebar extends Component {
  render() {
    if (typeof window !== 'undefined') {
      return ReactDOM.createPortal(
        <div
          className="vtex-minicart__sidebar fixed top-0 right-0 z-max bg-white mt8 shadow-2">
          <div
            className="vtex-minicart__sidebar-header flex flex-row items-center pa4"
            onClick={this.props.onBackClick}>
            <IconCaretLeft size={18} color="#FFFFFF" />
            <div className="mt2">
              <MiniCart showContent miniCartIconColor={'#FFFFFF'} />
            </div>
            <span className="ml3 white">Meu Carrinho</span>
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
