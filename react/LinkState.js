const gql = require('graphql-tag')

const minicartItemsQuery = gql`
  query {
    minicart @client {
      upToDate
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
        parentItemIndex
        parentAssemblyBinding
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
            upToDate: false,
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
          minicart: { __typename: 'Minicart', items, upToDate: false },
        },
      })
      return items
    },
    updateOrderForm: (_, { orderForm: newOrderForm }, { cache }) => {
      const orderForm = mapToLinkStateOrderForm(newOrderForm)
      cache.writeData({
        data: {
          minicart: { __typename: 'Minicart', orderForm },
        },
      })
      if (orderForm.items) {
        updateLinkStateItems(orderForm.items, cache)
      }
      return orderForm
    },
  },
}

function updateLinkStateItems(newItems, cache) {
  const items = newItems.map(mapToMinicartItem)
  cache.writeData({
    data: {
      minicart: { __typename: 'Minicart', items, upToDate: true },
    },
  })
  return items
}

const mapToLinkStateOrderForm = orderForm => ({
  __typename: 'OrderForm',
  ...orderForm,
  items: orderForm.items && orderForm.items.map(mapToOrderFormItem),
  totalizers:
    orderForm.totalizers && orderForm.totalizers.map(mapToOrderFormTotalizer),
  clientProfileData: orderForm.clientProfileData && {
    __typename: 'OrderFormClientProfileData',
    ...orderForm.clientProfileData,
  },
  shippingData:
    orderForm.shippingData &&
    mapToOrderFormShippingData(orderForm.shippingData),
  storePreferencesData:
    orderForm.storePreferencesData &&
    mapToOrderFormStorePreferences(orderForm.storePreferencesData),
})

const mapToOrderFormItem = item => ({
  __typename: 'OrderFormItem',
  ...item,
})

const mapToOrderFormTotalizer = totalizer => ({
  __typename: 'OrderFormTotalizer',
  ...totalizer,
})

const mapToOrderFormShippingData = ({ address, availableAddresses }) => ({
  __typename: 'OrderFormShippingData',
  address: address && mapToAddress(address),
  availableAddresses:
    availableAddresses && availableAddresses.map(mapToAddress),
})

const mapToAddress = address => ({
  __typename: 'Address',
  ...address,
})

const mapToOrderFormStorePreferences = storePreferencesData => ({
  __typename: 'OrderFormStorePreferencesData',
  ...storePreferencesData,
})

const mapToMinicartItem = item => ({
  __typename: 'MinicartItem',
  seller: null,
  index: null,
  parentItemIndex: null,
  parentAssemblyBinding: null,
  ...item,
})

const initialState = {
  minicart: {
    __typename: 'Minicart',
    items: [],
    upToDate: false,
    orderForm: null,
  },
}

module.exports = { resolvers, initialState, minicartItemsQuery }
