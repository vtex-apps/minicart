import gql from 'graphql-tag'

const addToCart = gql`
  mutation addToCart($items: [Item]) {
    addToCart(items: $items)
  }
`

export default addToCart
