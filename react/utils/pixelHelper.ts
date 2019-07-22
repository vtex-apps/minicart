export function mapCartItemToPixel(item: CartItem): PixelCartItem {
  return {
    skuId: item.id,
    variant: item.skuName,
    price: item.sellingPrice,
    name: item.name,
    quantity: item.quantity,
    productRefId: item.productRefId,
    brand: item.additionalInfo ? item.additionalInfo.brandName : '',
    category: productCategory(item),
  }
}

export function mapBuyButtonItemToPixel(item: BuyButtonItem): PixelCartItem {
  // Change this `/Apparel & Accessories/Clothing/Tops/`
  // to this `Apparel & Accessories/Clothing/Tops`
  const category = item.category
    ? item.category.slice(1).slice(0, -1)
    : ''

  return {
    skuId: item.id,
    variant: item.skuName,
    price: item.sellingPrice,
    name: item.name,
    quantity: item.quantity,
    productRefId: item.productRefId,
    brand: item.brand,
    category,
  }
}

function productCategory(item: CartItem) {
  try {
    const categoryIds = item.productCategoryIds.split('/').filter(c => c.length)
    const category = categoryIds.map(id => item.productCategories[id]).join('/')

    return category
  } catch {
    return ''
  }
}

interface PixelCartItem {
  skuId: string
  variant: string
  price: number
  name: string
  quantity: number
  productRefId: string
  brand: string
  category: string
}

interface BuyButtonItem {
  id: string
  skuName: string
  sellingPrice: number
  name: string
  quantity: number
  productRefId: string
  brand: string
  category: string
}

interface CartItem {
  id: string
  skuName: string
  sellingPrice: number
  name: string
  quantity: number
  productRefId: string
  additionalInfo: {
    brandName: string
  }
  productCategoryIds: string
  productCategories: Record<string, string>
}
