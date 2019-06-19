import classNames from 'classnames'
import { map, partition, path, pathOr, pick, isEmpty } from 'ramda'
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from 'react'
import { Button, ToastContext } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { IconCart } from 'vtex.store-icons'
import { orderForm } from 'vtex.store-resources/Queries'
import { addToCart, updateItems } from 'vtex.store-resources/Mutations'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import { compose, graphql, withApollo } from 'react-apollo'
import { injectIntl } from 'react-intl'

import MiniCartContent from './components/MiniCartContent'
import Sidebar from './components/Sidebar'
import Popup from './components/Popup'
import { shouldShowItem } from './utils/itemsHelper'

import { fullMinicartQuery } from './localState/queries'
import {
  addToCartMutation,
  updateItemsMutation,
  updateOrderFormMutation,
  updateItemsSentToServerMutation,
  setMinicartOpenMutation,
} from './localState/mutations'

import createLocalState, { ITEMS_STATUS } from './localState'

import minicart from './minicart.css'

const DEFAULT_LABEL_CLASSES = ''
const DEFAULT_ICON_CLASSES = 'gray'

const useOffline = () => {
  const [isOffline, setOffline] = useState(() =>
    typeof navigator !== 'undefined'
      ? !pathOr(true, ['onLine'], navigator)
      : false
  )

  useEffect(() => {
    const updateStatus = () => {
      if (navigator) {
        const offline = !pathOr(true, ['onLine'], navigator)
        setOffline(offline)
      }
    }

    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)

    return () => {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
    }
  }, [])

  return isOffline
}

const useLinkState = client => {
  useEffect(() => {
    const { resolvers, initialState } = createLocalState(client)
    client.addResolvers(resolvers)
    // Add the initial state to if there is not there
    try {
      client.readQuery({ query: fullMinicartQuery })
    } catch (err) {
      client.writeData({ data: initialState })
    }
  }, [client])
}

const getAddToCartEventItems = ({
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

const partitionItemsAddUpdate = clientItems => {
  const isNotInCart = item => item.cartIndex == null
  return partition(isNotInCart, clientItems)
}

/**
 * Minicart component
 */
const MiniCart = ({
  labelClasses = DEFAULT_LABEL_CLASSES,
  iconClasses = DEFAULT_ICON_CLASSES,
  client,
  setMinicartOpen,
  labelMiniCartEmpty,
  labelButtonFinishShopping,
  iconSize,
  iconLabel,
  showTotalItemsQty,
  showDiscount,
  data,
  type,
  hideContent,
  showShippingCost,
  linkState: { minicartItems = [], isOpen },
  linkState,
  updateOrderForm,
  addToLinkStateCart,
  intl,
  updateItemsSentToServer,
  updateItemsMutation,
  addToCartMutation,
}) => {
  useLinkState(client)

  const [isUpdatingOrderForm, setUpdatingOrderForm] = useState(false)
  const isOffline = useOffline()

  const {
    hints: { mobile },
    navigate,
  } = useRuntime()
  const { push } = usePixel()
  const { showToast } = useContext(ToastContext)

  const orderForm = pathOr(path(['orderForm'], linkState), ['orderForm'], data)

  const prevOrderForm = useRef(orderForm)

  useEffect(() => {
    if (orderForm !== prevOrderForm.current) {
      prevOrderForm.current = orderForm
    }
  }, [orderForm])

  const getModifiedItemsOnly = useCallback(() => {
    return minicartItems.filter(
      ({ localStatus }) => localStatus === ITEMS_STATUS.MODIFIED
    )
  }, [minicartItems])

  const saveDataIntoLocalStorage = useCallback(() => {
    const clientItems = getModifiedItemsOnly()
    if (localStorage && clientItems.length) {
      localStorage.setItem('minicart', JSON.stringify(clientItems))
      localStorage.setItem('orderForm', JSON.stringify(orderForm))
    }
  }, [getModifiedItemsOnly, orderForm])

  useEffect(() => {
    if (!localStorage) {
      return
    }

    const getDataFromLocalStorage = () => {
      try {
        const minicartData = JSON.parse(localStorage.getItem('minicart'))
        const orderFormData = JSON.parse(localStorage.getItem('orderForm'))
        return { minicartData, orderFormData }
      } catch (err) {
        return {}
      }
    }

    const updateLinkState = async () => {
      const { minicartData, orderFormData } = getDataFromLocalStorage()

      if (orderFormData && !orderForm) {
        await updateOrderForm(orderFormData)
        localStorage.removeItem('orderForm')
      }

      if (minicartData && minicartData.length && isEmpty(minicartItems)) {
        await addToLinkStateCart(minicartData)
        localStorage.removeItem('minicart')
      }
    }

    updateLinkState()
  }, [addToLinkStateCart, minicartItems, orderForm, updateOrderForm])

  const addItems = useCallback(
    items => {
      const { orderFormId } = orderForm
      if (items.length) {
        return addToCartMutation({
          variables: { orderFormId, items },
        })
      }
    },
    [addToCartMutation, orderForm]
  )

  const mutateUpdateItems = useCallback(
    items => {
      const { orderFormId } = orderForm
      if (items.length) {
        return updateItemsMutation({
          variables: { orderFormId, items },
        })
      }
    },
    [orderForm, updateItemsMutation]
  )

  const sendModifiedItemsToServer = useCallback(
    async modifiedItems => {
      const [itemsToAdd, itemsToUpdate] = partitionItemsAddUpdate(modifiedItems)
      await updateItemsSentToServer()
      const pickProps = map(
        pick(['id', 'index', 'quantity', 'seller', 'options'])
      )
      try {
        const updateItemsResponse = await mutateUpdateItems(
          pickProps(itemsToUpdate)
        )
        const removedItems = itemsToUpdate.filter(
          ({ quantity }) => quantity === 0
        )
        if (removedItems.length) {
          push({
            event: 'removeFromCart',
            items: removedItems,
          })
        }
        const addItemsResponse = await addItems(pickProps(itemsToAdd))

        if (itemsToAdd.length > 0) {
          push({
            event: 'addToCart',
            items: map(getAddToCartEventItems, itemsToAdd),
          })
        }
        const newModifiedItems = getModifiedItemsOnly()
        if (newModifiedItems.length > 0) {
          // If there are new modified items in cart, recursively call this function to send requests to server
          return sendModifiedItemsToServer(newModifiedItems)
        }

        const newOrderForm = pathOr(
          path(['data', 'addItem'], addItemsResponse),
          ['data', 'updateItems'],
          updateItemsResponse
        )
        await updateOrderForm(newOrderForm)
      } catch (err) {
        // TODO: Toast error message into Alert
        console.error(err)
        // Rollback items and orderForm
        showToast({
          message: intl.formatMessage({
            id: 'store/minicart.checkout-failure',
          }),
        })
        await updateOrderForm(orderForm)
      }

      setUpdatingOrderForm(false)
    },
    [
      addItems,
      getModifiedItemsOnly,
      intl,
      mutateUpdateItems,
      orderForm,
      push,
      showToast,
      updateItemsSentToServer,
      updateOrderForm,
    ]
  )

  const handleItemsDifference = useCallback(
    modifiedItems => {
      setUpdatingOrderForm(true)
      sendModifiedItemsToServer(modifiedItems)
    },
    [sendModifiedItemsToServer]
  )

  const handleItemsUpdate = useCallback(async () => {
    const modifiedItems = getModifiedItemsOnly()
    if (modifiedItems.length && !isUpdatingOrderForm && orderForm) {
      return handleItemsDifference(modifiedItems)
    }
  }, [
    getModifiedItemsOnly,
    handleItemsDifference,
    isUpdatingOrderForm,
    orderForm,
  ])

  const handleOrderFormUpdate = useCallback(async () => {
    if (!prevOrderForm.current && orderForm) {
      await updateOrderForm(orderForm)
    }
  }, [orderForm, updateOrderForm])

  useEffect(() => {
    const syncItemsWithServer = async () => {
      await handleItemsUpdate()
      await handleOrderFormUpdate()
      if (localStorage) {
        localStorage.removeItem('minicart')
        localStorage.removeItem('orderForm')
      }
    }

    if (!isOffline) {
      syncItemsWithServer()
    } else {
      saveDataIntoLocalStorage()
    }
  }, [
    handleItemsUpdate,
    handleOrderFormUpdate,
    isOffline,
    saveDataIntoLocalStorage,
  ])

  const setContentOpen = isOpen => setMinicartOpen(isOpen)

  const handleClickButton = event => {
    if (!hideContent) {
      setContentOpen(!linkState.isOpen)
    }
    event.persist()
  }

  const handleUpdateContentVisibility = () => {
    setContentOpen(false)
  }

  const handleClickProduct = detailUrl => {
    setContentOpen(false)
    navigate({
      to: detailUrl,
    })
  }

  const getFilteredItems = () => {
    return minicartItems.filter(shouldShowItem)
  }

  const itemsToShow = getFilteredItems()
  const totalItemsSum = arr =>
    arr.reduce((sum, product) => sum + product.quantity, 0)
  const quantity = showTotalItemsQty
    ? totalItemsSum(itemsToShow)
    : itemsToShow.length

  const isSizeLarge =
    (type && type === 'sidebar') ||
    mobile ||
    (window && window.innerWidth <= 480)

  const miniCartContent = (
    <MiniCartContent
      isSizeLarge={isSizeLarge}
      itemsToShow={itemsToShow}
      orderForm={{
        ...orderForm,
        items: minicartItems,
      }}
      loading={data.loading}
      showDiscount={showDiscount}
      labelMiniCartEmpty={labelMiniCartEmpty}
      labelButton={labelButtonFinishShopping}
      onClickProduct={handleClickProduct}
      onClickAction={handleUpdateContentVisibility}
      showShippingCost={showShippingCost}
      updatingOrderForm={isUpdatingOrderForm}
    />
  )

  const iconLabelClasses = classNames(
    `${minicart.label} dn-m db-l t-action--small ${labelClasses}`,
    {
      pl6: quantity > 0,
      pl4: quantity <= 0,
    }
  )

  return (
    <aside className={`${minicart.container} relative fr flex items-center`}>
      <div className="flex flex-column">
        <Button
          variation="tertiary"
          icon
          onClick={event => handleClickButton(event)}
        >
          <span className="flex items-center">
            <span className={`relative ${iconClasses}`}>
              <IconCart size={iconSize} />
              {quantity > 0 && (
                <span
                  data-testid="item-qty"
                  className={`${minicart.badge} c-on-emphasis absolute t-mini bg-emphasis br4 w1 h1 pa1 flex justify-center items-center lh-solid`}
                >
                  {quantity}
                </span>
              )}
            </span>
            {iconLabel && <span className={iconLabelClasses}>{iconLabel}</span>}
          </span>
        </Button>
        {!hideContent &&
          (isSizeLarge ? (
            <Sidebar
              quantity={quantity}
              iconSize={iconSize}
              onOutsideClick={handleUpdateContentVisibility}
              isOpen={isOpen}
            >
              {miniCartContent}
            </Sidebar>
          ) : (
            isOpen && (
              <Popup onOutsideClick={handleUpdateContentVisibility}>
                {miniCartContent}
              </Popup>
            )
          ))}
      </div>
    </aside>
  )
}

const withLinkStateMinicartQuery = graphql(fullMinicartQuery, {
  options: () => ({ ssr: false }),
  props: ({ data: { minicart } }) => ({
    linkState: minicart
      ? {
          minicartItems: JSON.parse(minicart.items),
          orderForm: JSON.parse(minicart.orderForm),
          isOpen: minicart.isOpen,
        }
      : {},
  }),
})

const withLinkStateUpdateItemsMutation = graphql(updateItemsMutation, {
  name: 'updateLinkStateItems',
  props: ({ updateLinkStateItems }) => ({
    updateLinkStateItems: items =>
      updateLinkStateItems({ variables: { items } }),
  }),
})

const withLinkStateAddToCartMutation = graphql(addToCartMutation, {
  name: 'addToLinkStateCart',
  props: ({ addToLinkStateCart }) => ({
    addToLinkStateCart: items => addToLinkStateCart({ variables: { items } }),
  }),
})

const withLinkStateUpdateOrderFormMutation = graphql(updateOrderFormMutation, {
  name: 'updateOrderForm',
  props: ({ updateOrderForm }) => ({
    updateOrderForm: orderForm => updateOrderForm({ variables: { orderForm } }),
  }),
})

const withLinkStateUpdateItemsSentToServerMutation = graphql(
  updateItemsSentToServerMutation,
  {
    name: 'updateItemsSentToServer',
    props: ({ updateItemsSentToServer }) => ({
      updateItemsSentToServer: () => updateItemsSentToServer(),
    }),
  }
)

const withLinkStateSetIsOpenMutation = graphql(setMinicartOpenMutation, {
  name: 'setMinicartOpen',
  props: ({ setMinicartOpen }) => ({
    setMinicartOpen: isOpen => setMinicartOpen({ variables: { isOpen } }),
  }),
})

const EnhancedMinicart = compose(
  graphql(orderForm, { options: () => ({ ssr: false }) }),
  graphql(addToCart, { name: 'addToCartMutation' }),
  graphql(updateItems, { name: 'updateItemsMutation' }),
  withApollo,
  withLinkStateMinicartQuery,
  withLinkStateUpdateItemsMutation,
  withLinkStateAddToCartMutation,
  withLinkStateUpdateOrderFormMutation,
  withLinkStateUpdateItemsSentToServerMutation,
  withLinkStateSetIsOpenMutation,
  injectIntl
)(MiniCart)

EnhancedMinicart.schema = {
  title: 'admin/editor.minicart.title',
  description: 'admin/editor.minicart.description',
  type: 'object',
  properties: {
    type: {
      title: 'admin/editor.minicart.type.title',
      type: 'string',
      default: 'popup',
      enum: ['popup', 'sidebar'],
      enumNames: [
        'admin/editor.minicart.type.popup',
        'admin/editor.minicart.type.sidebar',
      ],
      widget: {
        'ui:widget': 'radio',
        'ui:options': {
          inline: true,
        },
      },
      isLayout: true,
    },
    showDiscount: {
      title: 'admin/editor.minicart.showDiscount.title',
      type: 'boolean',
      isLayout: true,
    },
    labelMiniCartEmpty: {
      title: 'admin/editor.minicart.labelMiniCartEmpty.title',
      type: 'string',
      isLayout: false,
    },
    labelButtonFinishShopping: {
      title: 'admin/editor.minicart.labelButtonFinishShopping.title',
      type: 'string',
      isLayout: false,
    },
  },
}

export default EnhancedMinicart
