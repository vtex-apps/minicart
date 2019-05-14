import { useEffect } from 'react'
import { withToast } from 'vtex.styleguide'
import { addToCart, updateItems } from 'vtex.store-resources/Mutations'
import { compose, graphql, withApollo } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { map, partition, path, pathOr, pick } from 'ramda'
import { Pixel } from 'vtex.pixel-manager/PixelContext'

import { minicartItemsQuery } from '../localState/queries'
import { ITEMS_STATUS } from '../localState';

import {
  updateOrderFormMutation,
  updateItemsSentToServerMutation,
} from '../localState/mutations'

const modifiedItemsOnly = (items) => (items || []).filter(
  ({ localStatus }) => localStatus === ITEMS_STATUS.MODIFIED
)

const partitionItemsAddUpdate = items => {
  const isNotInCart = item => item.cartIndex == null
  return partition(isNotInCart, items)
}

const pickProps = map(
  pick(['id', 'index', 'quantity', 'seller', 'options'])
)

const callServerFunction = (fn, orderFormId, items) => {
  if (items.length > 0) {
    return fn({
      variables: { orderFormId, items }
    })
  }
  return null
}

const getRecentlyModifiedItems = (client) => {
  const {
    minicart: { items: prevItems },
  } = client.cache.readQuery({ query: minicartItemsQuery })
  return modifiedItemsOnly(JSON.parse(prevItems || '[]'))
}

const  getAddToCartEventItems = ({
  id: skuId,
  skuName: variant,
  sellingPrice: price,
  ...restSkuItem
}) => {
  return {
    skuId,
    variant,
    price,
    ...pick(['brand', 'name', 'quantity'], restSkuItem),
  }
}

const pushEvents = (push, itemsUpdate, itemsAdd) => {
  const removedItems = itemsUpdate.filter(
    ({ quantity }) => quantity === 0
  )
  if (removedItems.length > 0) {
    push({
      event: 'removeFromCart',
      items: removedItems,
    })
  }

  if (itemsAdd.length > 0) {
    push({
      event: 'addToCart',
      items: map(getAddToCartEventItems, itemsAdd),
    })
  }
}

const MinicartItemsManager = ({ 
  children, 
  orderForm, 
  items, 
  offline, 
  setUpdatingOrderForm, 
  updatingOrderForm,
  serverOrderForm,
  // props below come from HOCs
  updateItemsSentToServer,
  updateItems,
  addToCart,
  updateOrderForm,
  showToast,
  intl: { formatMessage },
  client,
  push,
}) => {
  const sendItemsToServer = async (modifiedItems) => {
    const [itemsToAdd, itemsToUpdate] = partitionItemsAddUpdate(
      modifiedItems
    )
    await updateItemsSentToServer()
    
    try {
      const updateItemsResponse = await callServerFunction(
        updateItems, orderForm.orderFormId, pickProps(itemsToUpdate),
      )
      const addItemsResponse = await callServerFunction(
        addToCart, orderForm.orderFormId, pickProps(itemsToAdd),
      )
      pushEvents(push, itemsToUpdate, itemsToAdd)
      const currentOrderForm = pathOr(
        path(['data', 'addItem'], addItemsResponse),
        ['data', 'updateItems'],
        updateItemsResponse
      )

      return { currentOrderForm, error: false }
    } catch(err) {
      console.error(err)
      return {
        currentOrderForm: serverOrderForm,
        error: true
      }
    }
  }

  const sendMoreOrSave = async (newOrderForm) => {
    let recentlyModified = getRecentlyModifiedItems(client)
    let updatedOrderForm
    if (recentlyModified.length === 0) {
      updatedOrderForm = newOrderForm
    }

    while (recentlyModified.length > 0) {
      // There are more items to update to server
      const { currentOrderForm, error } = await sendItemsToServer(recentlyModified)
      if (error) {
        showToast({
          message: formatMessage({ id: 'store/minicart.checkout-failure' }),
        })
      }
      updatedOrderForm = currentOrderForm
      recentlyModified = getRecentlyModifiedItems(client)
    }
    return updateOrderForm(updatedOrderForm)
  }

  useEffect(() => {
    if (!offline) {
      const modifiedItems = modifiedItemsOnly(items)
      if (modifiedItems.length && !updatingOrderForm && !!orderForm) {
        setUpdatingOrderForm(true)
        sendItemsToServer(modifiedItems)
        .then(({ currentOrderForm, error }) => {
          if (error) {
            showToast({
              message: formatMessage({ id: 'store/minicart.checkout-failure' }),
            })
          }
          sendMoreOrSave(currentOrderForm)
          .then(() => setUpdatingOrderForm(false))
          .catch(() => setUpdatingOrderForm(false))
        })
      }
    }
  })
  return children
}

const withLinkStateUpdateItemsSentToServerMutation = graphql(
  updateItemsSentToServerMutation,
  {
    name: 'updateItemsSentToServer',
    props: ({ updateItemsSentToServer }) => ({
      updateItemsSentToServer: () => updateItemsSentToServer(),
    }),
  }
)

const withLinkStateUpdateOrderFormMutation = graphql(updateOrderFormMutation, {
  name: 'updateOrderForm',
  props: ({ updateOrderForm }) => ({
    updateOrderForm: orderForm => updateOrderForm({ variables: { orderForm } }),
  }),
})

const enhanced = compose(
  graphql(addToCart, { name: 'addToCart' }),
  graphql(updateItems, { name: 'updateItems' }),
  withLinkStateUpdateItemsSentToServerMutation,
  withLinkStateUpdateOrderFormMutation,
  withToast,
  injectIntl,
  withApollo,
  Pixel,
)
export default enhanced(MinicartItemsManager)
