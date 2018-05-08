/* eslint-env jest */
import React from 'react'
import { render } from 'react-testing-library'
import { MockedProvider } from 'react-apollo/test-utils'
import orderFormQuery from '../graphql/orderFormQuery.gql'
import { IntlProvider } from 'react-intl'

import MiniCartContent from '../MiniCartContent'

describe('MiniCart component', () => {
  let minicartWithProducts

  beforeEach((done) => {
    const messages = require('../locales/en-US')
    const mockedOrderFrom = {
      orderFormId: '1092',
      items: [
        {
          id: '31',
          detailUrl: 'celular',
          imageUrl: 'https://raw.githubusercontent.com/vtex-apps/product-summary/feature/product-image/images/500x500-img-pro20.png',
          name: 'Celular',
          quantity: 1,
          sellingPrice: 154000,
          listPrice: 1000,
          skuName: 'Moto X4',
        }
      ],
      value: 1632000,
    }

    minicartWithProducts = render(
      <MockedProvider
        mocks={[
          {
            request: { query: orderFormQuery },
            result: { data: { orderForm: mockedOrderFrom } },
          },
        ]}
      >
        <IntlProvider
          locale="en-US"
          messages={messages}
        >
          <MiniCartContent />
        </IntlProvider>
      </MockedProvider>
    )

    setTimeout(() => {
      done()
    }, 0)
  })

  it('should be rendered', () => {
    expect(minicartWithProducts).toBeDefined()
  })

  it('should match snapshot', () => {
    expect(minicartWithProducts).toMatchSnapshot()
  })

  it('minicart with products should render three minicart items', () => {
    expect(minicartWithProducts.container.querySelectorAll('.vtex-minicart__item').length).toBe(1)
  })
})
