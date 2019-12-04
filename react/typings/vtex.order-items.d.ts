declare module 'vtex.order-items/OrderItems' {
  import { OrderItems } from 'vtex.order-items'

  const useOrderItems = OrderItems.useOrderItems

  const OrderItemsProvider = OrderItems.OrderItemsProvider

  export { useOrderItems, OrderItemsProvider }
}
