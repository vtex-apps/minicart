import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class Sidebar extends Component {
  render() {
    if (typeof window !== 'undefined') {
      const root = document.getElementsByClassName('waza')
      console.log(root)
      return ReactDOM.createPortal(
        <div className="absolute top-0 right-0 h-100 z-max bg-white">
          <h1>Hello from Sidebar</h1>
        </div>,
        root[0]
      )
    }
    return null
  }
}
