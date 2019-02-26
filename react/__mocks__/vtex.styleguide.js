import React from 'react'

export const Button = props => (
  <button {...props}>Button Test{props.children}</button>
)

export const Spinner = ({ children }) => <div>{children}</div>
