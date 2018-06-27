import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class Sidebar extends Component {
  render() {
    const root = document.getElementsByClassName('vtex-store__template')
    console.log(root)
    return ReactDOM.createPortal(
      <div className="absolute h-100 z-max bg-white">
        <h1>Hello from Sidebar</h1>
      </div>,
      root[0]
    )
  }
}
