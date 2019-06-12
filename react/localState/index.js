import { head, mergeDeepRight, values } from 'ramda'

import {
  updateOrderFormShipping,
  updateOrderFormCheckin,
} from 'vtex.store-resources/Mutations'
import {
  minicartItemsQuery,
  minicartOrderFormQuery,
  minicartIsOpenQuery,
} from './queries'

import updateItems from './resolvers/updateItems'
import addToCart from './resolvers/addToCart'
import updateItemsSentToServer from './resolvers/updateItemsSentToServer'

export const ITEMS_STATUS = {
  NONE: 'NONE',
  MODIFIED: 'MODIFIED',
  WAITING_SERVER: 'WAITING_SERVER',
}

/* eslint-disable @typescript-eslint/no-use-before-define */

// Need this for circular dependency

const mapToOrderFormItem = item => ({
  ...item,
  assemblyOptions: mapAssemblyOptions(item.assemblyOptions),
  __typename: 'OrderFormItem',
})

const mapAssemblyOptions = (options = {}) => ({
  parentPrice: null,
  ...options,
  added: (options.added || []).map(added => ({
    ...added,
    item: added.item && mapToOrderFormItem(added.item),
    __typename: 'AddedAssemblyOptions',
  })),
  removed: (options.removed || []).map(option => ({
    ...option,
    __typename: 'RemovedAssemblyOption',
  })),
  __typename: 'AssemblyOptions',
})

/* eslint-enable @typescript-eslint/no-use-before-define */

const mapToAddress = address => ({
  ...address,
  __typename: 'Address',
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

const mapToOrderFormStorePreferences = storePreferencesData => ({
  ...storePreferencesData,
  __typename: 'OrderFormStorePreferencesData',
})

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

const mapItemOptions = option => ({
  seller: null,
  assemblyId: null,
  id: null,
  quantity: null,
  ...option,
  __typename: 'MinicartItemOptions',
})

export const mapToMinicartItem = item => ({
  seller: null,
  index: null,
  parentItemIndex: null,
  parentAssemblyBinding: null,
  imageUrl: null,
  id: null,
  name: null,
  detailUrl: null,
  skuName: null,
  quantity: null,
  sellingPrice: null,
  listPrice: null,
  cartIndex: null,
  ...item,
  options: item.options ? item.options.map(mapItemOptions) : null,
  assemblyOptions: mapAssemblyOptions(item.assemblyOptions),
  __typename: 'MinicartItem',
})

const updateLinkStateItems = (newItems, cache) => {
  const items = newItems.map(item =>
    mapToMinicartItem({
      ...item,
      localStatus: ITEMS_STATUS.NONE,
    })
  )

  cache.writeData({
    data: {
      minicart: { __typename: 'Minicart', items: JSON.stringify(items) },
    },
  })
  return items
}

export default function(client) {
  const replayOrderFormServerMutation = mutation => async (
    _,
    variables,
    { cache }
  ) => {
    const response = await client.mutate({
      variables,
      mutation,
    })

    const updatedOrderForm = head(values(response.data))

    const {
      minicart: { orderForm: outdatedOrderForm },
    } = cache.readQuery({ query: minicartOrderFormQuery })

    const orderForm = JSON.stringify(
      mergeDeepRight(JSON.parse(outdatedOrderForm), updatedOrderForm)
    )
    cache.writeData({
      data: {
        minicart: { __typename: 'Minicart', orderForm },
      },
    })
    return orderForm
  }

  const resolvers = {
    Mutation: {
      addToCart: (_, { items }, { cache }) => {
        const query = minicartItemsQuery
        const {
          minicart: { items: prevItems },
        } = cache.readQuery({ query })

        const writeItems = addToCart(JSON.parse(prevItems), items)
        cache.writeData({
          data: {
            minicart: {
              __typename: 'Minicart',
              items: JSON.stringify(writeItems),
            },
          },
        })
        return writeItems
      },
      updateItems: (_, { items: newItems }, { cache }) => {
        const query = minicartItemsQuery
        const {
          minicart: { items: prevItems },
        } = cache.readQuery({ query })
        const newCartItems = updateItems(JSON.parse(prevItems), newItems)
        cache.writeData({
          data: {
            minicart: {
              __typename: 'Minicart',
              items: JSON.stringify(newCartItems),
            },
          },
        })
        return newCartItems
      },
      updateOrderForm: (_, { orderForm: newOrderForm }, { cache }) => {
        const orderForm = mapToLinkStateOrderForm(newOrderForm)
        cache.writeData({
          data: {
            minicart: {
              __typename: 'Minicart',
              orderForm: JSON.stringify(orderForm),
            },
          },
        })
        if (orderForm.items) {
          updateLinkStateItems(orderForm.items, cache)
        }
        return orderForm
      },
      updateOrderFormShipping: replayOrderFormServerMutation(
        updateOrderFormShipping
      ),
      updateOrderFormCheckin: replayOrderFormServerMutation(
        updateOrderFormCheckin
      ),
      updateItemsSentToServer: (_, __, { cache }) => {
        const query = minicartItemsQuery
        const {
          minicart: { items: prevItems },
        } = cache.readQuery({ query })
        const itemsWithStatus = updateItemsSentToServer(JSON.parse(prevItems))
        cache.writeData({
          data: {
            minicart: {
              __typename: 'Minicart',
              items: JSON.stringify(itemsWithStatus),
            },
          },
        })
        return itemsWithStatus
      },
      setMinicartOpen: (_, { isOpen }, { cache }) => {
        cache.writeQuery({
          query: minicartIsOpenQuery,
          data: {
            minicart: {
              __typename: 'Minicart',
              isOpen,
            },
          },
        })
        return true
      },
    },
  }

  const initialState = {
    minicart: {
      __typename: 'Minicart',
      items: '[]',
      orderForm: null,
      isOpen: false,
    },
  }

  return { resolvers, initialState }
}
