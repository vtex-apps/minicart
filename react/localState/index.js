import { head, mergeDeepRight, values } from 'ramda'

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
    const response = await client.mutate({
      variables,
      mutation,
    })

    const updatedOrderForm = head(values(response.data))

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

        const newItems = items.map(item => mapToMinicartItem({ ...item, upToDate: false }))
        const writeItems = [...prevItems, ...newItems]
        cache.writeData({
          data: {
            minicart: {
              __typename: 'Minicart',
              items: writeItems,
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

        // Items provided to this function MUST have a valid index property
        const cleanNewItems = newItems.filter(({ index }) => index != null)
        const items = [...prevItems]

        for (const newItem of cleanNewItems) {
          const { index } = newItem
          const prevItem = prevItems[index]
          items[index] = mapToMinicartItem(mergeDeepRight(prevItem, { ...newItem, upToDate: false }))
        }

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
    options: item.options ? item.options.map(mapItemOptions) : [],
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
