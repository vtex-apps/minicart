/* eslint-env jest */
import orderFormQuery from '../graphql/orderFormQuery.gql'

it('should be the correct query', () => {
  expect(orderFormQuery).toMatchSnapshot()
})
