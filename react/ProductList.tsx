import React, { FC } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useOrderItems } from 'vtex.order-items/OrderItems'
import { ExtensionPoint } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager/PixelContext'

const adjustSkuItemForPixelEvent = (
  skuItem: OrderFormItem,
  quantity?: number
) => {
  const categoryIds = skuItem.productCategoryIds.split('/')
  const itemCategory = categoryIds
    .map(categoryId => skuItem.productCategories[categoryId])
    .join('/')
    .slice(1, -1)

  return {
    skuId: skuItem.id,
    variant: skuItem.skuName,
    price: skuItem.price,
    name: skuItem.name,
    quantity: quantity || skuItem.quantity,
    productRefId: skuItem.productRefId,
    brand: skuItem.additionalInfo.brandName,
    category: itemCategory,
  }
}

const ProductList: FC = () => {
  const { orderForm } = useOrderForm()
  const { updateQuantity, removeItem } = useOrderItems()
  const { push } = usePixel()

  const items = (orderForm && orderForm.items) || []

  const handleQuantityChange = (
    uniqueId: string,
    quantity: number,
    item: OrderFormItem
  ) => {
    const adjustedItem = adjustSkuItemForPixelEvent(item, quantity)
    push({
      event: 'addToCart',
      items: [adjustedItem],
    })
    updateQuantity({ uniqueId, quantity })
  }
  const handleRemove = (uniqueId: string, item: OrderFormItem) => {
    const adjustedItem = adjustSkuItemForPixelEvent(item)
    push({
      event: 'removeFromCart',
      items: [adjustedItem],
    })
    removeItem({ uniqueId })
  }

  return (
    <div className="overflow-y-auto">
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
