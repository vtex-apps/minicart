import { head, mergeDeepRight, values } from 'ramda'
import {
  updateOrderFormShipping,
  updateOrderFormCheckin,
} from 'vtex.store-resources/Mutations'

import fullMinicartQuery from './graphql/fullMinicartQuery.gql'

import updateItems from './resolvers/updateItems'
import addToCart from './resolvers/addToCart'

export const ITEMS_STATUS = {
  NONE: 'NONE',
  MODIFIED: 'MODIFIED',
  LOCAL_ITEM: 'LOCAL_ITEM',
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

    const data = cache.readQuery({ query: fullMinicartQuery })

    const orderForm = JSON.stringify(
      mergeDeepRight(JSON.parse(data.minicart.orderForm), updatedOrderForm)
    )
    cache.writeQuery({
      query: fullMinicartQuery,
      data: {
        ...data,
        minicart: {
          ...data.minicart,
          orderForm,
        },
      },
    })
    return orderForm
  }

  const resolvers = {
    Mutation: {
      addToCart: (_, { items }, { cache }) => {
        const data = cache.readQuery({ query: fullMinicartQuery })

        const writeItems = addToCart(JSON.parse(data.minicart.items), items)
        cache.writeQuery({
          query: fullMinicartQuery,
          data: {
            ...data,
            minicart: {
              ...data.minicart,
              items: JSON.stringify(writeItems),
            },
          },
        })
        return writeItems
      },
      updateItems: (_, { items: newItems }, { cache }) => {
        const data = cache.readQuery({ query: fullMinicartQuery })
        const newCartItems = updateItems(
          JSON.parse(data.minicart.items),
          newItems
        )

        cache.writeQuery({
          query: fullMinicartQuery,
          data: {
            ...data,
            minicart: {
              ...data.minicart,
              items: JSON.stringify(newCartItems),
            },
          },
        })
        return newCartItems
      },
      updateOrderForm: (_, { orderForm }, { cache }) => {
        const data = cache.readQuery({ query: fullMinicartQuery })

        const prevItems = JSON.parse(data.minicart.items)
        const orderFormItems = (orderForm.items || []).map(item => ({
          ...item,
          localStatus: ITEMS_STATUS.NONE,
        }))

        const allItems = orderFormItems.concat(
          prevItems
            .map(item => ({
              ...item,
              localStatus:
                item.localStatus === ITEMS_STATUS.MODIFIED
                  ? ITEMS_STATUS.NONE
                  : item.localStatus,
            }))
            .filter(({ localStatus }) => localStatus !== ITEMS_STATUS.NONE)
        )

        cache.writeQuery({
          query: fullMinicartQuery,
          data: {
            ...data,
            minicart: {
              ...data.minicart,
              orderForm: JSON.stringify(orderForm),
              items: JSON.stringify(allItems),
            },
          },
        })

        return orderForm
      },
      updateLocalItemStatus: (_, __, { cache }) => {
        const data = cache.readQuery({ query: fullMinicartQuery })
        const prevItems = JSON.parse(data.minicart.items)

        const updatedItems = prevItems.map(item => ({
          ...item,
          localStatus:
            item.localStatus === ITEMS_STATUS.LOCAL_ITEM
              ? ITEMS_STATUS.MODIFIED
              : item.localStatus,
        }))

        cache.writeQuery({
          query: fullMinicartQuery,
          data: {
            ...data,
            minicart: {
              ...data.minicart,
              items: JSON.stringify(updatedItems),
            },
          },
        })

        return true
      },
      updateOrderFormShipping: replayOrderFormServerMutation(
        updateOrderFormShipping
      ),
      updateOrderFormCheckin: replayOrderFormServerMutation(
        updateOrderFormCheckin
      ),
      setMinicartOpen: (_, { isOpen }, { cache }) => {
        const data = cache.readQuery({ query: fullMinicartQuery })
        cache.writeQuery({
          query: fullMinicartQuery,
          data: {
            ...data,
            minicart: {
              ...data.minicart,
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
