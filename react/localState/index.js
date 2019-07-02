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
      updateOrderForm: (_, { orderForm }, { cache }) => {
        const query = minicartItemsQuery
        const {
          minicart: { items: itemsString },
        } = cache.readQuery({ query })

        const prevItems = JSON.parse(itemsString)
        const items = (orderForm.items || []).map(item => ({
          ...item,
          localStatus: ITEMS_STATUS.NONE,
        }))

        const allItems = prevItems
          .map(item => ({
            ...item,
            localStatus:
              item.localStatus === ITEMS_STATUS.WAITING_SERVER
                ? ITEMS_STATUS.NONE
                : item.localStatus,
          }))
          .filter(({ localStatus }) => localStatus !== ITEMS_STATUS.NONE)
          .concat(items)

        cache.writeData({
          data: {
            minicart: {
              __typename: 'Minicart',
              orderForm: JSON.stringify(orderForm),
              items: JSON.stringify(allItems),
            },
          },
        })

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
