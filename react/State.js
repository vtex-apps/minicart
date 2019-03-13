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

export const resolvers = {
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
      return newItems.concat(prevItems)
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
  ...orderForm,
  __typename: 'OrderFormClient',
  items: orderForm.items && orderForm.items.map(mapToOrderFormItem),
  totalizers:
    orderForm.totalizers && orderForm.totalizers.map(mapToOrderFormTotalizer),
  clientProfileData: orderForm.clientProfileData && {
    ...orderForm.clientProfileData,
    __typename: 'OrderFormClientProfileData',
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
    ...options,
    added:
      options.added &&
      options.added.map(added => ({
        item: added.item && mapToOrderFormItem(added.item),
        ...added,
        __typename: 'AddedAssemblyOptions',
      })),
    removed:
      options.removed &&
      options.removed.map(option => ({
        ...option,
        __typename: 'RemovedAssemblyOption',
      })),
    __typename: 'AssemblyOptions',
  }

const mapToOrderFormItem = item => ({
  ...item,
  assemblyOptions: mapAssemblyOptions(item.assemblyOptions),
  __typename: 'OrderFormItem',
})

const mapToOrderFormTotalizer = totalizer => ({
  ...totalizer,
  __typename: 'OrderFormTotalizer',
})

const mapToOrderFormShippingData = ({ address, availableAddresses }) => ({
  address: address && mapToAddress(address),
  availableAddresses:
    availableAddresses && availableAddresses.map(mapToAddress),
  __typename: 'OrderFormShippingData',
})

const mapToAddress = address => ({
  ...address,
  __typename: 'Address',
})

const mapToOrderFormStorePreferences = storePreferencesData => ({
  ...storePreferencesData,
  __typename: 'OrderFormStorePreferencesData',
})

const mapToMinicartItem = item => ({
  seller: null,
  index: null,
  parentItemIndex: null,
  parentAssemblyBinding: null,
  ...item,
  __typename: 'MinicartItem',
})

export const initialState = {
  minicart: {
    __typename: 'Minicart',
    items: [],
    orderForm: null,
  },
}
