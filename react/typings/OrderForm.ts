interface OrderFormContext {
  orderForm: OrderForm
  loading: boolean
}

interface OrderFormItem {
  additionalInfo: ItemAdditionalInfo
  availability: string
  detailUrl: string
  id: string
  imageUrl: string
  listPrice: number
  measurementUnit: string
  name: string
  price: number
  productId: string
  quantity: number
  sellingPrice: number
  skuName: string
  skuSpecifications: SKUSpecification[]
  uniqueId: string
  productCategories: Record<string, string>
  productCategoryIds: string
  productRefId: string
  refId: string
  seller?: string
  parentItemIndex: number | null
}

interface OrderFormItemWithIndex extends OrderFormItem {
  index: number
}

interface ItemAdditionalInfo {
  brandName: string
}

interface SKUSpecification {
  fieldName: string
  fieldValues: string[]
}

interface OrderForm {
  id: string
  items: OrderFormItem[]
  marketingData: MarketingData
  totalizers: Totalizer[]
  value: number
  messages: OrderFormMessages
  paymentData?: unknown
  shippingData?: ShippingData
}

interface MarketingData {
  coupon: string
}

interface Totalizer {
  id: string
  name: string
  value: number
  __typename?: string
}

interface OrderFormMessages {
  couponMessages: Message[]
  generalMessages: Message[]
}

interface Message {
  code: string
  status: string
  text: string
}

interface ShippingDataLogisticsInfo {
  itemIndex: number
  selectedSla: string | null
  slas: ShippingDataSla[]
  selectedDeliveryChannel?: 'delivery' | 'pickup-in-point'
}

interface ShippingDataSla {
  id: string
  name?: string
  deliveryChannel: string
  price: number
  deliveryIds?: ShippingDataDeliveryId[]
}

interface ShippingDataDeliveryId {
  courierId: string
  warehouseId: string
  dockId: string
}

interface ShippingData {
  address?: ShippingDataAddress
  logisticsInfo?: ShippingDataLogisticsInfo[]
}

interface ShippingDataAddress {
  addressId?: string
}

interface CheckoutOrderFormResponse {
  shippingData?: ShippingData
}
