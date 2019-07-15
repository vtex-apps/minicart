import React from 'react'
import { MockedProvider } from 'react-apollo/test-utils'
import { render, fireEvent } from '@vtex/test-tools/react'
import { orderForm as orderFormQuery } from 'vtex.store-resources/Queries'
import wait from 'waait'

import orderForm from '../__mocks__/orderForm'
import MiniCart from './../index'

const mocks = [
  {
    request: {
      query: orderFormQuery,
    },
    result: {
      data: {
        orderForm,
      },
    },
  },
]

describe('<MiniCart /> component', () => {
  async function resolveApolloQueries() {
    // Waits until the GraphQL queries resolve. The initial data is loading but in the
    // next cicle, it gets the mocked data
    // See: https://www.apollographql.com/docs/react/recipes/testing.html

    // Server queries
    await wait(0)
    // Local state queries
    await wait(0)
  }

  it('should be rendered', () => {
    const { asFragment } = render(<MiniCart type="popup" hideContent={false} />)
    expect(asFragment()).toBeDefined()
  })

  it('should render popup onClick', async () => {
    const { getByText, baseElement } = render(
      <MiniCart type="popup" hideContent={false} />
    )

    await resolveApolloQueries()

    let box = baseElement.querySelector('.box')
    let sidebar = baseElement.querySelector('.sidebar')

    // Expect box be null before click
    expect(box).toBeNull()
    // Sidebar should not exist before and after click
    expect(sidebar).toBeNull()

    fireEvent.click(getByText('Button Test'))

    await wait(0)
    box = baseElement.querySelector('.box')
    sidebar = baseElement.querySelector('.sidebar')

    // Expect Minicart Popup redered
    expect(box).toBeDefined()
    expect(box).not.toBeNull()
    // Expect sidebar still not rendered
    expect(sidebar).toBeNull()
  })

  it('should display sidebar onClick', async () => {
    const { getByText, baseElement } = render(
      <MiniCart type="sidebar" hideContent={false} />
    )

    await resolveApolloQueries()

    let box = baseElement.querySelector('.box')
    let sidebar = baseElement.querySelector('.sidebarScrim.dn')

    // Expect box be null before and after click
    expect(box).toBeNull()
    // Sidebar should have diplay none class before click
    expect(sidebar).toBeDefined()
    expect(sidebar).not.toBeNull()

    fireEvent.click(getByText('Button Test'))

    await wait(0)
    box = baseElement.querySelector('.box')
    sidebar = baseElement.querySelector('.sidebarScrim.dn')

    // Expect sidebar dont have display none after click
    expect(sidebar).toBeNull()
    expect(box).toBeNull()
  })

  it('should match the snapshot in popup mode', async () => {
    const leftClick = { button: 0 }

    const { getByText, asFragment } = render(
      <MockedProvider mocks={mocks}>
        <MiniCart type="popup" hideContent={false} />
      </MockedProvider>
    )

    await resolveApolloQueries()

    fireEvent.click(getByText('Button Test'), leftClick)

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match the snapshot in sidebar mode', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={mocks}>
        <MiniCart type="sidebar" hideContent={false} />
      </MockedProvider>
    )

    await resolveApolloQueries()
    expect(baseElement).toMatchSnapshot()
  })

  it('should be editable in Site Editor', () => {
    const schema = MiniCart.schema || MiniCart.getSchema({})
    expect(schema).toEqual(
      expect.objectContaining({ title: expect.any(String) })
    )
  })

  it('should not show item quantity if there are no items in cart', () => {
    const {queryByTitle} = render(
      <MiniCart type="sidebar" hideContent={false} showTotalItemsQty={false}/>
    )
    expect(queryByTitle('item-qnt')).toBeNull()
  })

  it('should show the quantity of different items in cart', async () => {
    const {getByTitle} = render(
      <MockedProvider mocks={mocks}>
        <MiniCart type="sidebar" hideContent={false} showTotalItemsQty={false}/>
      </MockedProvider>
    )
    await resolveApolloQueries()
    expect(getByTitle('item-qty').textContent).toBe('1')
    
  })

  it('should show the quantity of different items in cart', async () => {
    const {getByTitle} = render(
      <MockedProvider mocks={mocks}>
        <MiniCart type="sidebar" hideContent={false} showTotalItemsQty={true}/>
      </MockedProvider>
    )
    await resolveApolloQueries()
    expect(getByTitle('item-qty').textContent).toBe('2')
    
  })

})
