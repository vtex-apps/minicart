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

        const newItems = items.map(item =>
          mapToMinicartItem({ ...item, upToDate: false })
        )
        const writeItems = [...JSON.parse(prevItems), ...newItems]

        console.log('teste add to cart writing: ', JSON.stringify(writeItems))
        try {
          cache.writeData({
            data: {
              minicart: {
                __typename: 'Minicart',
                items: JSON.stringify(writeItems),
              },
            },
          })
        } catch (err) {
          console.log('teste ERRO: ', err)
        }
        return writeItems
      },
      updateItems: (_, { items: newItems }, { cache }) => {
        // UPDATE ITEMS MUST PASS INDEX on newItems :)
        console.log('teste updateItems!!!')
        const query = minicartItemsQuery
        const {
          minicart: { items: prevItems },
        } = cache.readQuery({ query })

        const cleanNewItems = newItems.filter(({ index }) => index != null)
        const items = [...JSON.parse(prevItems)]

        for (let i = 0; i < cleanNewItems.length; i++) {
          const newItem = cleanNewItems[i]
          const { index } = newItem
          const prevItem = JSON.parse(prevItems)[index]
          items[index] = mapToMinicartItem(
            mergeDeepRight(prevItem, { ...newItem, upToDate: false })
          )
        }

        // const items = prevItems.map((prevItem, index) => {
        //   const
        //   // console.log('teste found newItem: ', newItem)
        //   const item = newItem
        //     ? mergeDeepRight(prevItem, { ...newItem, upToDate: false })
        //     : prevItem
        //   return mapToMinicartItem(item)
        // })
        // const items = prevItems.map((prevItem, index) => {
        //   const newItem = newItems.find(({ id }) => id === prevItem.id)
        // const item = newItem
        //   ? mergeDeepRight(prevItem, { ...newItem, upToDate: false })
        //   : prevItem
        // return mapToMinicartItem({ ...item, index })
        // })

        console.log('teste updateItems writing: ', items)
        cache.writeData({
          data: {
            minicart: { __typename: 'Minicart', items: JSON.stringify(items) },
          },
        })
        return JSON.stringify(items)
      },
      updateOrderForm: (_, { orderForm: newOrderForm }, { cache }) => {
        const orderForm = mapToLinkStateOrderForm(newOrderForm)
        console.log('teste orderForm: ', orderForm)
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
        return JSON.stringify(orderForm)
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
    console.log('teste updateLinkStateItems writing: ', items)

    cache.writeData({
      data: {
        minicart: { __typename: 'Minicart', items: JSON.stringify(items) },
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
    // itemMetadata: orderForm.itemMetadata ? mapToOrderFormStoreItemMetadata(orderForm.itemMetadata) : null,
  })

  // id
  //           name
  //           skuName
  //           productId
  //           refId
  //           ean
  //           imageUrl
  //           detailUrl

  const mapToItemMetdataItem = itemMetdataItem => ({
    detailUrl: null,
    ean: null,
    id: null,
    imageUrl: null,
    skuName: null,
    name: null,
    productId: null,
    refId: null,
    ...itemMetdataItem,
    assemblyOptions: (itemMetdataItem.assemblyOptions || []).map(
      mapToMetadataAssemblyOptionItem
    ),
    __typename: 'OrderFormClientMetadataItem',
  })

  const mapToMetadataAssemblyOptionItem = MetadataAssemblyOption => ({
    id: null,
    name: null,
    required: null,
  })

  const mapToOrderFormStoreItemMetadata = itemMetadata => ({
    ...itemMetadata,
    __typename: 'OrderFormClientItemMetadata',
    items: itemMetadata.items.map(mapToItemMetdataItem),
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
      items: '[]',
      orderForm: null,
    },
  }

  return { resolvers, initialState }
}
