import gql from 'graphql-tag'

export const updateItemsMutation = gql`
  mutation updateItems($items: [MinicartItem]) {
    updateItems(items: $items) @client
  }
`

export const updateOrderFormMutation = gql`
  mutation updateOrderForm($orderForm: [OrderForm]) {
    updateOrderForm(orderForm: $orderForm) @client
  }
`

export const updateItemsSentToServerMutation = gql`
  mutation updateItemsSentToServer {
    updateItemsSentToServer @client
  }
`