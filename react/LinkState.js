const gql = require('graphql-tag')

const resolvers = {
  Mutation: {
    addToCart: (_, { item }, { cache }) => {
      const query = gql`
        query {
          minicart @client {
            items
          }
        }
      `
      const { items, ...rest } = cache.readQuery({ query })

      cache.writeData({ data: { items: [...items, item], ...rest } })
      return null
    },
  },
}

const initialState = { minicart: { orderForm: null, items: [] } }

module.exports = { resolvers, initialState }
