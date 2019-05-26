import React from 'react'

const push = () => null

export const withPixel = WrappedComponent => props => (
  <WrappedComponent {...props} push={push} />
)
