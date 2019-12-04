declare module 'vtex.order-manager/OrderForm' {
  import { OrderForm } from 'vtex.order-manager'

  export const useOrderForm: typeof OrderForm.useOrderForm

  export const OrderFormProvider: typeof OrderForm.OrderFormProvider
}
