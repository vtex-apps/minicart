import gql from 'graphql-tag'
import { mergeDeepRight } from 'ramda'

import {
  updateOrderFormShipping,
  updateOrderFormCheckin,
} from 'vtex.store-resources/Mutations'
import { minicartItemsQuery, minicartOrderFormQuery } from './queries'

export default function(client) {
  const replayOrderFormServerMutation = mutation => async (
    _,
    variables,
    { cache }
  ) => {
    const updatedOrderForm = await client.mutate({
      variables,
      mutation,
    })

    const {
      minicart: { orderForm: outdatedOrderForm },
    } = cache.readQuery({ query: minicartOrderFormQuery })

    const orderForm = mergeDeepRight(outdatedOrderForm, updatedOrderForm)
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

        const items = prevItems.map((prevItem, index) => {
          const newItem = newItems.find(({ id }) => id === prevItem.id)
          const item = newItem
            ? mergeDeepRight(prevItem, { ...newItem, upToDate: false })
            : prevItem
          return mapToMinicartItem({ ...item, index })
        })

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
      updateOrderFormShipping: replayOrderFormServerMutation(
        updateOrderFormShipping
      ),
      updateOrderFormCheckin: replayOrderFormServerMutation(
        updateOrderFormCheckin
      ),
    },
  }

  const updateLinkStateItems = (newItems, cache) => {
    const items = newItems.map(item =>
      mapToMinicartItem({
        ...item,
        upToDate: true,
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

  const mapItemOptions = option => ({
    seller: null,
    assemblyId: null,
    id: null,
    quantity: null,
    ...option,
    __typename: 'MinicartItemOptions',
  })

  const mapToMinicartItem = item => ({
    seller: null,
    index: null,
    parentItemIndex: null,
    parentAssemblyBinding: null,
    ...item,
    options: item.options ? item.options.map(mapItemOptions) : null,
    assemblyOptions: mapAssemblyOptions(item.assemblyOptions),
    __typename: 'MinicartItem',
  })

  const initialState = {
    minicart: {
      __typename: 'Minicart',
      items: [],
      orderForm: null,
    },
  }

  return { resolvers, initialState }
}
