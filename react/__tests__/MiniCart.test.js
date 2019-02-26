import React from 'react'
import { render } from 'test-utils'
import { fireEvent } from 'react-testing-library'

import MiniCart from './../index'

describe('<MiniCart /> component', () => {
  it('should be rendered', () => {
    const { asFragment } = render(<MiniCart type="popup" hideContent={false} />)
    expect(asFragment()).toBeDefined()
  })

  it('should match the snapshot in popup mode', () => {
    const leftClick = { button: 0 }

    const { getByText, asFragment } = render(
      <MiniCart type="popup" hideContent={false} />
    )
    fireEvent.click(getByText('Button Test'), leftClick)

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match the snapshot in sidebar mode', () => {
    const { baseElement } = render(
      <MiniCart type="sidebar" hideContent={false} />
    )
    expect(baseElement).toMatchSnapshot()
  })
})
