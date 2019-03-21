import React from 'react'

export const Pixel = WrappedComponent => props => (
  <div className="pixel-mock">
    <WrappedComponent {...props} />
  </div>
)
