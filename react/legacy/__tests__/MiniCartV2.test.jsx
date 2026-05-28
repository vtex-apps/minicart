/* eslint-disable global-require */
import React from 'react'
import { render, wait } from '@vtex/test-tools/react'

import { Minicart } from '../../Minicart'
import { MinicartStateContext } from '../../MinicartContext'
import { transformOrderFormItems } from '../../modules/pixelHelper'
import orderForm from '../__fixtures__/orderForm'

const mockedUsePixelPush = jest.fn()

jest.mock('vtex.pixel-manager', () => ({
  usePixel: () => ({ push: mockedUsePixelPush }),
}))

jest.mock('vtex.order-manager/OrderForm', () => {
  const mockData = require('../__fixtures__/orderForm')

  return {
    useOrderForm: jest
      .fn(() => ({
        orderForm: mockData.default,
      }))
      .mockImplementationOnce(() => ({
        orderForm: [],
      })),
  }
})

const minicartMockContextValue = {
  variation: 'drawer',
  open: true,
  hasBeenOpened: false,
  openOnHoverProp: false,
  openBehavior: 'click',
}

describe('<MiniCart /> v2', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('should trigger vtex:viewCart when cart is opened and match items when cart is empty', async () => {
    render(
      <MinicartStateContext.Provider value={minicartMockContextValue}>
        <Minicart variation="drawer" />
      </MinicartStateContext.Provider>
    )

    await wait(async () => {
      jest.runAllTimers()
    })

    const expectedPixelEvent = {
      event: 'viewCart',
      items: [],
    }

    expect(mockedUsePixelPush).toHaveBeenCalledWith(expectedPixelEvent)
  })

  it('should trigger vtex:viewCart when cart is opened and match items when cart is with products', async () => {
    render(
      <MinicartStateContext.Provider value={minicartMockContextValue}>
        <Minicart variation="drawer" />
      </MinicartStateContext.Provider>
    )

    await wait(async () => {
      jest.runAllTimers()
    })

    const expectedPixelEvent = {
      event: 'viewCart',
      items: transformOrderFormItems(orderForm.items),
    }

    expect(mockedUsePixelPush).toHaveBeenCalledWith(expectedPixelEvent)
  })
})
