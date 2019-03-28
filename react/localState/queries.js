import gql from 'graphql-tag'

export const fullMinicartQuery = gql`
  query {
    minicart @client {
      items {
        upToDate
        id
        name
        imageUrl
        detailUrl
        skuName
        quantity
        sellingPrice
        listPrice
        seller
        index
        parentItemIndex
        parentAssemblyBinding
        cartIndex
        options {
          seller
          assemblyId
          quantity
          id
        }
        assemblyOptions {
          parentPrice
          added {
            normalizedQuantity
            choiceType
            extraQuantity
            item {
              name
              sellingPrice
              quantity
            }
          }
          removed {
            removedQuantity
            initialQuantity
            name
          }
        }
      }
      orderForm {
        cacheId
        orderFormId
        value
        totalizers {
          id
          name
          value
        }
        shippingData {
          address {
            id
            neighborhood
            complement
            number
            street
            postalCode
            city
            reference
            addressName
            addressType
          }
          availableAddresses {
            id
            neighborhood
            complement
            number
            street
            postalCode
            city
            reference
            addressName
            addressType
          }
        }
        clientProfileData {
          email
          firstName
        }
        storePreferencesData {
          countryCode
          currencyCode
          timeZone
        }
      }
    }
  }
`

export const minicartOrderFormQuery = gql`
  query orderForm {
    minicart @client {
      orderForm {
        cacheId
        orderFormId
        value
        totalizers {
          id
          name
          value
        }
        shippingData {
          address {
            id
            neighborhood
            complement
            number
            street
            postalCode
            city
            reference
            addressName
            addressType
          }
          availableAddresses {
            id
            neighborhood
            complement
            number
            street
            postalCode
            city
            reference
            addressName
            addressType
          }
        }
        clientProfileData {
          email
          firstName
        }
        storePreferencesData {
          countryCode
          currencyCode
          timeZone
        }
      }
    }
  }
`

export const minicartItemsQuery = gql`
  query {
    minicart @client {
      items {
        upToDate
        id
        name
        imageUrl
        detailUrl
        skuName
        quantity
        sellingPrice
        listPrice
        seller
        index
        parentItemIndex
        parentAssemblyBinding
        cartIndex
        options {
          seller
          quantity
          assemblyId
          id
        }
        assemblyOptions {
          added {
            item {
              name
              sellingPrice
              quantity
            }
            normalizedQuantity
            choiceType
            extraQuantity
          }
          removed {
            removedQuantity
            initialQuantity
            name
          }
          parentPrice
        }
      }
    }
  }
`
