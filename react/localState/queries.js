import gql from 'graphql-tag'

export const fullMinicartQuery = gql`
  query {
    minicart @client {
      items
      orderForm
      isOpen
    }
  }
`

export const minicartOrderFormQuery = gql`
  query orderForm {
    minicart @client {
      orderForm
    }
  }
`

export const minicartItemsQuery = gql`
  query {
    minicart @client {
      items
    }
  }
`

export const minicartIsOpenQuery = gql`
  query {
    minicart @client {
      isOpen
    }
  }
`
