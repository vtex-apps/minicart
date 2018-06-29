import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import MiniCart from '../MiniCart'
import PropTypes from 'prop-types'

import '../global.css'

export default class Sidebar extends Component {
  render() {
    if (typeof window !== 'undefined') {
      return ReactDOM.createPortal(
        <div
          className="vtex-minicart__sidebar fixed top-0 right-0 z-max bg-white mt8 shadow-2"
          onMouseLeave={this.props.onMouseLeave}
          onMouseEnter={this.props.onMouseEnter}>
          <div className="vtex-minicart__sidebar-header flex flex-row items-center pa4">
            <div className="mt2"><MiniCart showContent miniCartIconColor={'#FFFFFF'} /></div>
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
  /* Function to be called when the mouse enter the sidebar */
  onMouseEnter: PropTypes.func.isRequired,
  /* Function to be called when the mouse leave the sidebar */
  onMouseLeave: PropTypes.func.isRequired,
}
