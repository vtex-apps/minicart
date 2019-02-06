const gql = require('graphql-tag')

const minicartItemsQuery = gql`
  query {
    minicart @client {
      items {
        id
        name
        imageUrl
        detailUrl
        skuName
        quantity
        sellingPrice
        listPrice
        seller
        index
      }
    }
  }
`

const resolvers = {
  Mutation: {
    addToCart: (_, { items }, { cache }) => {
      const query = minicartItemsQuery
      const {
        minicart: { items: prevItems },
      } = cache.readQuery({ query })

      const indexedItems = items.map(item => ({
        index: prevItems.findIndex(({ id }) => id === item.id),
        item,
      }))

      const newItems = []
      for (const indexedItem of indexedItems) {
        const { index, item } = indexedItem
        if (index !== -1) {
          prevItems[index] = item
        } else {
          newItems.push(item)
        }
      }

      cache.writeData({
        data: {
          minicart: {
            __typename: 'Minicart',
            items: newItems.concat(prevItems).map(mapToMinicartItem),
          },
        },
      })
      return newItems
    },
    updateItems: (_, { items: newItems }, { cache }) => {
      const query = minicartItemsQuery
      const {
        minicart: { items: prevItems },
      } = cache.readQuery({ query })

      const items = prevItems
        .map(prevItem => {
          const newItem = newItems.find(({ id }) => id === prevItem.id)
          return newItem || prevItem
        })
        .map(mapToMinicartItem)

      cache.writeData({
        data: {
          minicart: { __typename: 'Minicart', items },
        },
      })
      return items
    },
    fillCart: (_, { items: newItems }, { cache }) => {
      const items = newItems.map(mapToMinicartItem)
      cache.writeData({
        data: {
          minicart: { __typename: 'Minicart', items },
        },
      })
      return items
    },
  },
}

const mapToMinicartItem = item => ({
  __typename: 'MinicartItem',
  seller: null,
  index: null,
  ...item,
})

const initialState = {
  minicart: { __typename: 'Minicart', items: [] },
}

module.exports = { resolvers, initialState }
