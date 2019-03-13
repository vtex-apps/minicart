import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'
import wait from 'waait'

import MiniCart from './../index'

describe('<MiniCart /> component', () => {
  async function resolveApolloQueries() {
    // Server queries
    await wait(0)
    // Local state queries
    await wait(0)
  }

  it('should be rendered', () => {
    const { asFragment } = render(<MiniCart type="popup" hideContent={false} />)
    expect(asFragment()).toBeDefined()
  })

  it('should render popup onClick', () => {
    const { getByText, baseElement } = render(
      <MiniCart type="popup" hideContent={false} />
    )

    let box = baseElement.querySelector('.box')
    let sidebar = baseElement.querySelector('.sidebar')

    // Expect box be null before click
    expect(box).toBeNull()
    // Sidebar should not exist before and after click
    expect(sidebar).toBeNull()

    fireEvent.click(getByText('Button Test'))

    box = baseElement.querySelector('.box')
    sidebar = baseElement.querySelector('.sidebar')

    // Expect Minicart Popup redered
    expect(box).toBeDefined()
    expect(box).not.toBeNull()
    // Expect sidebar still not rendered
    expect(sidebar).toBeNull()
  })

  it('should display sidebar onClick', () => {
    const { getByText, baseElement } = render(
      <MiniCart type="sidebar" hideContent={false} />
    )

    let box = baseElement.querySelector('.box')
    let sidebar = baseElement.querySelector('.sidebarScrim.dn')

    // Expect box be null before and after click
    expect(box).toBeNull()
    // Sidebar should have diplay none class before click
    expect(sidebar).toBeDefined()
    expect(sidebar).not.toBeNull()

    fireEvent.click(getByText('Button Test'))

    box = baseElement.querySelector('.box')
    sidebar = baseElement.querySelector('.sidebarScrim.dn')

    // Expect sidebar dont have display none after click
    expect(sidebar).toBeNull()
    expect(box).toBeNull()
  })

  it('should match the snapshot in popup mode', async () => {
    const leftClick = { button: 0 }

    const { getByText, asFragment } = render(
      <MiniCart type="popup" hideContent={false} />
    )

    await resolveApolloQueries()

    fireEvent.click(getByText('Button Test'), leftClick)

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match the snapshot in sidebar mode', async () => {
    const { baseElement } = render(
      <MiniCart type="sidebar" hideContent={false} />
    )

    await resolveApolloQueries()
    expect(baseElement).toMatchSnapshot()
  })
})
