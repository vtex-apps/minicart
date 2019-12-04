declare module 'vtex.order-manager/OrderForm' {
  import { OrderForm } from 'vtex.order-manager'

  const useOrderForm = OrderForm.useOrderForm

  const OrderFormProvider = OrderForm.OrderFormProvider

  export { useOrderForm, OrderFormProvider }
}
