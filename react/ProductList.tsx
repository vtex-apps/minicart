import React, { FC, useEffect } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { OrderItemsProvider, useOrderItems } from 'vtex.order-items/OrderItems'
import { ExtensionPoint } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import { useCssHandles } from 'vtex.css-handles'
import { mapCartItemToPixel } from './modules/pixelHelper'

const CSS_HANDLES = ['minicartProductListContainer'] as const

const ProductList: FC = () => {
  const {
    orderForm: { items },
  } = useOrderForm()
  const { updateQuantity, removeItem } = useOrderItems()
  const { push } = usePixel()
  const handles = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    push({
      event: 'cartChanged',
      items: items.map(mapCartItemToPixel)
    })
  }, [items])

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
    <div className={`${handles.minicartProductListContainer} overflow-y-auto`}>
      <ExtensionPoint
        id="product-list"
        items={items}
        onQuantityChange={handleQuantityChange}
        onRemove={handleRemove}
      />
    </div>
  )
}

const EnhancedProductList = () => (
  <OrderItemsProvider>
    <ProductList />
  </OrderItemsProvider>
)

export default EnhancedProductList
