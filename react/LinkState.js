const gql = require('graphql-tag')

const minicartItemsQuery = gql`
  query {
    minicart @client {
      items {
        upToDate
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
        item: mapToMinicartItem({
          ...item,
          upToDate: false,
        }),
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
            items: newItems.concat(prevItems),
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
          return newItem ? { ...newItem, upToDate: false } : prevItem
        })
        .map(mapToMinicartItem)

      cache.writeData({
        data: {
          minicart: { __typename: 'Minicart', items },
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
  const items = newItems.map(item =>
    mapToMinicartItem({
      upToDate: true,
      ...item,
    })
  )

  cache.writeData({
    data: {
      minicart: { __typename: 'Minicart', items },
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

const mapAssemblyOptions = options =>
  options && {
    __typename: 'AssemblyOptions',
    ...options,
    added:
      options.added &&
      options.added.map(added => ({
        __typename: 'AddedAssemblyOptions',
        item: added.item && mapToOrderFormItem(added.item),
        ...added,
      })),
    removed: options.removed && {
      __typename: 'RemovedAssemblyOptions',
      ...options.removed,
    },
  }

const mapToOrderFormItem = item => ({
  __typename: 'OrderFormItem',
  ...item,
  assemblyOptions: mapAssemblyOptions(item.assemblyOptions),
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
  seller: null,
  index: null,
  parentItemIndex: null,
  parentAssemblyBinding: null,
  ...item,
  __typename: 'MinicartItem',
})

const initialState = {
  minicart: {
    __typename: 'Minicart',
    items: [],
    orderForm: null,
  },
}

module.exports = { resolvers, initialState, minicartItemsQuery }
