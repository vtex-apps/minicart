import gql from 'graphql-tag'

const updateItems = gql`
  mutation updateItems($items: [Item]) {
    updateItems(items: $items)
  }
`

export default updateItems
