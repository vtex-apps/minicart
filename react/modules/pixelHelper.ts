export function mapCartItemToPixel(item: CartItem): PixelCartItem {
  return {
    skuId: item.id,
    variant: item.skuName,
    price: item.sellingPrice,
    priceIsInt: true,
    name: getNameWithoutVariant(item),
    quantity: item.quantity,
    productId: item.productId,
    productRefId: item.productRefId,
    brand: item.additionalInfo ? item.additionalInfo.brandName : '',
    category: productCategory(item),
    detailUrl: item.detailUrl,
    imageUrl: item.imageUrls
      ? fixUrlProtocol(item.imageUrls.at3x)
      : item.imageUrl ?? '',
    referenceId: item.refId,
  }
}

export function mapBuyButtonItemToPixel(item: BuyButtonItem): PixelCartItem {
  // Change this `/Apparel & Accessories/Clothing/Tops/`
  // to this `Apparel & Accessories/Clothing/Tops`
  const category = item.category ? item.category.slice(1, -1) : ''

  return {
    skuId: item.id,
    variant: item.skuName,
    price: item.sellingPrice,
    priceIsInt: true,
    name: item.name,
    quantity: item.quantity,
    productId: item.productId,
    productRefId: item.productRefId,
    brand: item.brand,
    category,
    detailUrl: item.detailUrl,
    imageUrl: item.imageUrl,
    referenceId: item.refId,
  }
}

/**
 * URL comes like "//storecomponents.vteximg.com.br/arquivos/ids/155491"
 * this function guarantees it comes with protocol in it.
 */
function fixUrlProtocol(url: string) {
  if (!url || url.indexOf('http') === 0) {
    return url
  }

  return `https:${url}`
}

/**
 * Remove the variant from the end of the name.
 * Ex: from "Classic Shoes Pink" to "Classic Shoes"
 * Ps: Some products has the name of the variation the same as the item
 */
function getNameWithoutVariant(item: CartItem) {
  if (
    (item?.name && !item.name.includes(item.skuName)) ||
    item.name === item.skuName
  ) {
    return item.name
  }

  const leadingSpace = 1
  const variantLength = leadingSpace + item.skuName.length

  return item.name.slice(0, item.name.length - variantLength)
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

export function transformOrderFormItems(orderFormItems: OrderForm['items']) {
  if (!orderFormItems || !orderFormItems.length) return []
  return orderFormItems.map(item => mapCartItemToPixel(item))
}

export interface PixelCartItem {
  skuId: string
  variant: string
  price: number
  priceIsInt: boolean
  name: string
  quantity: number
  productId: string
  productRefId: string
  brand: string
  category: string
  detailUrl: string
  imageUrl: string
  referenceId: string
}

interface BuyButtonItem {
  id: string
  skuName: string
  sellingPrice: number
  name: string
  quantity: number
  productId: string
  productRefId: string
  brand: string
  category: string
  detailUrl: string
  imageUrl: string
  refId: string
}

interface CartItem {
  id: string
  skuName: string
  sellingPrice: number
  name: string
  quantity: number
  productId: string
  productRefId: string
  additionalInfo: {
    brandName: string
  }
  productCategoryIds: string
  productCategories: Record<string, string>
  detailUrl: string
  // Field from the usual orderForm API
  imageUrl?: string
  // Field from the order-manager orderForm API
  imageUrls?: {
    at1x: string
    at2x: string
    at3x: string
  }
  refId: string
}
