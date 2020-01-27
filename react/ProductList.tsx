import React, { FC } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { OrderItemsProvider, useOrderItems } from 'vtex.order-items/OrderItems'
import { ExtensionPoint } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import { useCssHandles } from 'vtex.css-handles'
import { mapCartItemToPixel } from './modules/pixelHelper'

interface Props {
  renderAsChildren: boolean
}

const CSS_HANDLES = ['minicartProductListContainer'] as const

const ProductList: FC<Props> = ({ renderAsChildren }) => {
  const {
    orderForm: { items },
  } = useOrderForm()
  const { updateQuantity, removeItem } = useOrderItems()
  const { push } = usePixel()
  const handles = useCssHandles(CSS_HANDLES)

  const handleQuantityChange = (
    uniqueId: string,
    quantity: number,
    item: OrderFormItem
  ) => {
    const adjustedItem = {
      ...mapCartItemToPixel(item),
      quantity,
    }

    push({
      event: 'addToCart',
      items: [adjustedItem],
    })
    updateQuantity({ uniqueId, quantity })
  }
  const handleRemove = (uniqueId: string, item: OrderFormItem) => {
    const adjustedItem = mapCartItemToPixel(item)
    push({
      event: 'removeFromCart',
      items: [adjustedItem],
    })
    removeItem({ uniqueId })
  }

  return (
    <div
      className={`${handles.minicartProductListContainer} ${
        renderAsChildren ? 'w-100 h-100' : ''
      } overflow-y-auto`}
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

const EnhancedProductList: FC<Props> = ({ renderAsChildren }) => (
  <OrderItemsProvider>
    <ProductList renderAsChildren={renderAsChildren} />
  </OrderItemsProvider>
)

export default EnhancedProductList
