import type { Item } from 'vtex.checkout-graphql'

export function mapCartItemToPixel(item: Item): PixelCartItem {
  return {
    skuId: item.id,
    variant: item.skuName!,
    price: item.sellingPrice!,
    name: getNameWithoutVariant(item),
    quantity: item.quantity,
    productId: item.productId!,
    productRefId: item.productRefId!,
    brand: item.additionalInfo ? item.additionalInfo.brandName! : '',
    category: productCategory(item),
    detailUrl: item.detailUrl!,
    imageUrl: item.imageUrls
      ? fixUrlProtocol(item.imageUrls.at3x)
      : (item as any).imageUrl ?? '',
    referenceId: item.refId!,
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
 */
function getNameWithoutVariant(item: Item) {
  if (!item.name!.includes(item.skuName!)) {
    return item.name!
  }

  const leadingSpace = 1
  const variantLength = leadingSpace + item.skuName!.length

  return item.name!.slice(0, item.name!.length - variantLength)
}

function productCategory(item: Item) {
  try {
    const categoryIds = item
      .productCategoryIds!.split('/')
      .filter((c) => c.length)

    const category = categoryIds
      .map((id) => item.productCategories[id])
      .join('/')

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
