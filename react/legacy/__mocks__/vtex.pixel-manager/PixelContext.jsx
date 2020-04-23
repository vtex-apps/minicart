import React from 'react'

const push = () => null

export const withPixel = WrappedComponent => {
  const WithPixel = props => <WrappedComponent {...props} push={push} />
  return WithPixel
}

export const usePixel = () => ({
  push: jest.fn(),
})
