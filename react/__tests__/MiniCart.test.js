import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'
import { orderForm as orderFormQuery } from 'vtex.store-resources/Queries'

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

describe('<MiniCart />', () => {
  function flushPromises() {
    return new Promise(resolve => setImmediate(resolve))
  }

  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('should be rendered', () => {
    const { asFragment } = render(<MiniCart type="popup" hideContent={false} />)
    expect(asFragment()).toBeDefined()
  })

  it('should render popup onClick', async () => {
    const { getByText, baseElement } = render(
      <MiniCart type="popup" hideContent={false} />
    )

    await flushPromises()
    jest.runAllTimers()

    let box = baseElement.querySelector('.box')
    let sidebar = baseElement.querySelector('.sidebar')

    // Expect box be null before click
    expect(box).toBeNull()
    // Sidebar should not exist before and after click
    expect(sidebar).toBeNull()

    fireEvent.click(getByText(/button test/i))

    await flushPromises()
    jest.runAllTimers()

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

    await flushPromises()
    jest.runAllTimers()

    let box = baseElement.querySelector('.box')
    let sidebar = baseElement.querySelector('.sidebarScrim.dn')

    // Expect box be null before and after click
    expect(box).toBeNull()
    // Sidebar should have diplay none class before click
    expect(sidebar).toBeDefined()
    expect(sidebar).not.toBeNull()

    fireEvent.click(getByText(/button test/i))

    await flushPromises()
    jest.runAllTimers()

    box = baseElement.querySelector('.box')
    sidebar = baseElement.querySelector('.sidebarScrim.dn')

    // Expect sidebar dont have display none after click
    expect(sidebar).toBeNull()
    expect(box).toBeNull()
  })

  it('should match the snapshot in popup mode', async () => {
    const leftClick = { button: 0 }

    const { getByText, asFragment } = render(
      <MiniCart type="popup" hideContent={false} />,
      { graphql: { mocks } }
    )

    await flushPromises()
    jest.runAllTimers()

    fireEvent.click(getByText(/button test/i), leftClick)

    await flushPromises()
    jest.runAllTimers()

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match the snapshot in sidebar mode', async () => {
    const { baseElement } = render(
      <MiniCart type="sidebar" hideContent={false} />,
      { graphql: { mocks } }
    )

    await flushPromises()
    jest.runAllTimers()

    expect(baseElement).toMatchSnapshot()
  })

  it('should be editable in Site Editor', () => {
    const schema = MiniCart.schema || MiniCart.getSchema({})
    expect(schema).toEqual(
      expect.objectContaining({ title: expect.any(String) })
    )
  })

  it('should not show item quantity if there are no items in cart', () => {
    const { queryByTestId } = render(
      <MiniCart type="sidebar" hideContent={false} showTotalItemsQty={false} />
    )
    expect(queryByTestId('item-qty')).toBeNull()
  })

  it('should show the quantity of different items in cart', async () => {
    const { getByTestId } = render(
      <MiniCart type="sidebar" hideContent={false} showTotalItemsQty={false} />,
      { graphql: { mocks } }
    )

    await flushPromises()
    jest.runAllTimers()

    expect(getByTestId('item-qty').textContent).toBe('1')
  })

  it('should show the total quantity of items in cart', async () => {
    const { getByTestId } = render(
      <MiniCart type="sidebar" hideContent={false} showTotalItemsQty />,
      { graphql: { mocks } }
    )

    await flushPromises()
    jest.runAllTimers()

    expect(getByTestId('item-qty').textContent).toBe('2')
  })

  it('should not show price if showPrice is false', async () => {
    const { queryByTestId } = render(
      <MiniCart type="sidebar" hideContent={false} showPrice={false} />,
      { graphql: { mocks } }
    )
    await flushPromises()
    jest.runAllTimers()
    expect(queryByTestId('total-price')).toBeNull()
  })

  it('should not show price if there are no items in the cart', () => {
    const { queryByTestId } = render(
      <MiniCart type="sidebar" hideContent={false} showPrice />
    )
    expect(queryByTestId('total-price')).toBeNull()
  })

  it('should show price if there are items in the cart', async () => {
    const { getByTestId } = render(
      <MiniCart type="sidebar" hideContent={false} showPrice />,
      { graphql: { mocks } }
    )
    await flushPromises()
    jest.runAllTimers()
    expect(getByTestId('total-price')).toBeInTheDocument()
  })

  it('should not show price if showPrice is false', async () => {
    const { queryByTestId } = render(
      <MiniCart type="sidebar" hideContent={false} showPrice={false} />,
      { graphql: { mocks } }
    )
    await flushPromises()
    jest.runAllTimers()
    expect(queryByTestId('total-price')).toBeNull()
  })

  it('should not show price if there are no items in the cart', () => {
    const { queryByTestId } = render(
      <MiniCart type="sidebar" hideContent={false} showPrice />
    )
    expect(queryByTestId('total-price')).toBeNull()
  })

  it('should show price if there are items in the cart', async () => {
    const { getByTestId } = render(
      <MiniCart type="sidebar" hideContent={false} showPrice />,
      { graphql: { mocks } }
    )
    await flushPromises()
    jest.runAllTimers()
    expect(getByTestId('total-price')).toBeInTheDocument()
  })
})
