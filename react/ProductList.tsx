import type { FC } from 'react'
import React, { useCallback } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useOrderItems } from 'vtex.order-items/OrderItems'
import { ExtensionPoint } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager'
import type { CssHandlesTypes } from 'vtex.css-handles'
import { useCssHandles } from 'vtex.css-handles'
import type { Item } from 'vtex.checkout-graphql'

import { mapCartItemToPixel } from './modules/pixelHelper'

const CSS_HANDLES = ['minicartProductListContainer'] as const

interface Props {
  renderAsChildren: boolean
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

const ProductList: FC<Props> = ({ renderAsChildren, classes }) => {
  const {
    orderForm: { allowManualPrice, items: orderFormItems, userType },
    loading,
  } = useOrderForm()

  const { setManualPrice, updateItems } = useOrderItems()

  const { push } = usePixel()
  const { handles } = useCssHandles(CSS_HANDLES, { classes })

  const handleUpdateItems = useCallback(
    (items: Item[]) => {
      const updatedItems = items.filter((item) => item.quantity > 0)
      const removedItems = items.filter((item) => item.quantity === 0)

      if (updatedItems.length > 0) {
        const adjustedItems = updatedItems.map((item) => ({
          ...mapCartItemToPixel(item),
          quantity: item.quantity,
        }))

        push({ event: 'addToCart', items: adjustedItems })
      }

      if (removedItems.length > 0) {
        const adjustedItems = removedItems.map((item) => ({
          ...mapCartItemToPixel(item),
          quantity: item.quantity,
        }))

        push({ event: 'removeFromCart', items: adjustedItems })
      }

      updateItems(items)
    },
    [push, updateItems]
  )

  const handleRemove = useCallback(
    (uniqueId: string, item: Item) => {
      handleUpdateItems([{ ...item, uniqueId, quantity: 0 }])
    },
    [handleUpdateItems]
  )

  const handleQuantityChange = useCallback(
    (uniqueId: string, quantity: number, item: Item) => {
      handleUpdateItems([{ ...item, uniqueId, quantity }])
    },
    [handleUpdateItems]
  )

  const handleSetManualPrice = useCallback(
    (price: number, itemIndex: number) => {
      setManualPrice(price, itemIndex)
    },
    [setManualPrice]
  )

  return (
    <div
      /* 
        This prevents an interaction with the quantity selector
        inside of a product in the ProductList to bubble up a
        mouseleave event to the Popup component, which would result
        in the minicart being closed (when openOnHover = true). 
      */
      onMouseLeave={(e) => e.stopPropagation()}
      className={`${handles.minicartProductListContainer} ${
        renderAsChildren ? 'w-100 h-100' : ''
      } overflow-y-auto ph4 ph6-l`}
    >
      <ExtensionPoint
        id="product-list"
        allowManualPrice={allowManualPrice}
        items={orderFormItems}
        loading={loading}
        userType={userType}
        onQuantityChange={handleQuantityChange}
        onRemove={handleRemove}
        onUpdateItems={handleUpdateItems}
        onSetManualPrice={handleSetManualPrice}
      />
    </div>
  )
}

export default ProductList
