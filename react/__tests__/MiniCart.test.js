import React from 'react'
import { render } from 'test-utils'
import { fireEvent } from 'react-testing-library'

import MiniCart from './../index'

describe('<MiniCart /> component', () => {
  const renderComponent = customProps => {
    const props = {
      type: 'popup',
      hideContent: false,
      ...customProps,
    }
    return render(<MiniCart {...props} />)
  }

  it('should be rendered', () => {
    expect(renderComponent().asFragment()).toBeDefined()
  })

  it('should match the snapshot in popup mode', () => {
    const wrapper = renderComponent()
    const leftClick = { button: 0 }
    const { getByText } = wrapper
    fireEvent.click(getByText('Button Test'), leftClick)
    expect(wrapper.asFragment()).toMatchSnapshot()
  })

  it('should match the snapshot in sidebar mode', () => {
    expect(renderComponent({ type: 'sidebar' }).baseElement).toMatchSnapshot()
  })
})
