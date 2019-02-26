import React from 'react'
import { render } from 'test-utils'

import { MiniCart } from './../index'

describe('<MiniCart /> component', () => {
  const renderComponent = customProps => {
    const props = {
      type: 'popup',
      orderFormContext: {
        orderForm: {
          items: [],
        },
      },
      ...customProps,
    }
    return render(<MiniCart {...props} />)
  }

  it('should be rendered', () => {
    expect(renderComponent().asFragment()).toBeDefined()
  })

  it('should match the snapshot', () => {
    expect(renderComponent().asFragment()).toMatchSnapshot()
  })
})
