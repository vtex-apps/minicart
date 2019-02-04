const gql = require('graphql-tag')

const resolvers = {
  Mutation: {
    addToCart: (_, { items }, { cache }) => {
      const query = gql`
        query {
          minicart @client {
            items
          }
        }
      `
      const {
        minicart: { items: prevItems },
        ...rest
      } = cache.readQuery({ query })

      const newItems = [...prevItems, ...items].map(item => ({
        __typename: 'MinicartItem',
        ...item,
      }))
      cache.writeData({ data: { items: newItems, ...rest } })
      return newItems
    },
  },
}

const initialState = {
  minicart: { __typename: 'Minicart', orderForm: null, items: [] },
}

module.exports = { resolvers, initialState }
