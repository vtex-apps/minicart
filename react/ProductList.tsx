import React, { FC, useCallback } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useOrderItems } from 'vtex.order-items/OrderItems'
import { ExtensionPoint } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager'
import { CssHandlesTypes, useCssHandles } from 'vtex.css-handles'

import { mapCartItemToPixel } from './modules/pixelHelper'

const CSS_HANDLES = ['minicartProductListContainer'] as const

interface Props {
  renderAsChildren: boolean
  splitItem?: boolean
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

const ProductList: FC<Props> = ({
  renderAsChildren,
  splitItem = true,
  classes,
}) => {
  const {
    orderForm: { items },
  } = useOrderForm()
  const { updateQuantity, removeItem } = useOrderItems()
  const { push } = usePixel()
  const { handles } = useCssHandles(CSS_HANDLES, { classes })

  const options = {
    allowedOutdatedData: ['paymentData'],
    splitItem,
  }

  const handleQuantityChange = useCallback(
    (_: string, quantity: number, item: OrderFormItemWithIndex) => {
      if (quantity === item.quantity) {
        return
      }

      const quantityIncreased = quantity > item.quantity

      if (quantityIncreased) {
        const adjustedItem = {
          ...mapCartItemToPixel(item),
          quantity: quantity - item.quantity,
        }

        push({
          event: 'addToCart',
          items: [adjustedItem],
        })
      } else {
        const adjustedItem = {
          ...mapCartItemToPixel(item),
          quantity: item.quantity - quantity,
        }

        push({
          event: 'removeFromCart',
          items: [adjustedItem],
        })
      }

      updateQuantity({ index: item.index, quantity }, options)
    },
    [options, push, updateQuantity]
  )

  const handleRemove = useCallback(
    (uniqueId: string, item: OrderFormItem) => {
      const adjustedItem = mapCartItemToPixel(item)
      push({
        event: 'removeFromCart',
        items: [adjustedItem],
      })
      removeItem({ uniqueId }, options)
    },
    [options, push, removeItem]
  )

  return (
    <div
      /*
        This prevents an interaction with the quantity selector
        inside of a product in the ProductList to bubble up a
        mouseleave event to the Popup component, which would result
        in the minicart being closed (when openOnHover = true).
      */
      onMouseLeave={e => e.stopPropagation()}
      className={`${handles.minicartProductListContainer} ${renderAsChildren ? 'w-100 h-100' : ''
        } overflow-y-auto ph4 ph6-l`}
    >
      <ExtensionPoint
        id="product-list"
        items={items}
        onQuantityChange={handleQuantityChange}
        onRemove={handleRemove}
      />
    </div>
  )
}

export default ProductList
