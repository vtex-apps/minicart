/* eslint-env jest */
import React from 'react'
import { render } from 'react-testing-library'
import { MockedProvider } from 'react-apollo/test-utils'
import orderFormQuery from '../graphql/orderFormQuery.gql'
import { IntlProvider } from 'react-intl'

import MiniCart from '../MiniCart'

describe('MiniCart component', () => {
  let wrapper

  beforeEach(() => {
    const mockedOrderFrom = {
      orderFormId: '1092',
      items: [],
      value: 1632000,
    }
    const messages = require('../locales/en-US')

    wrapper = render(
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
          <MiniCart />
        </IntlProvider>
      </MockedProvider>
    )
  })

  it('should be rendered', () => {
    expect(wrapper).toBeDefined()
  })

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
