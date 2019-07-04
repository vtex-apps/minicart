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

export const ITEMS_STATUS = {
  NONE: 'NONE',
  MODIFIED: 'MODIFIED',
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
        const orderFormItems = (orderForm.items || []).map(item => ({
          ...item,
          localStatus: ITEMS_STATUS.NONE,
        }))

        const allItems = orderFormItems.concat(
          prevItems
            .map(item => ({
              ...item,
              localStatus: ITEMS_STATUS.NONE,
            }))
            .filter(({ localStatus }) => localStatus !== ITEMS_STATUS.NONE)
        )

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
