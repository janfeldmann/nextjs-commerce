export const DeliveryDetails = /* GraphQL */ `
  fragment DeliveryDetails on Checkout {
    availableShippingMethods {
      id
      name
      description
    }
    availableCollectionPoints {
      id
      name
      address {
        streetAddress1
        streetAddress2
        city
        postalCode
        firstName
        lastName
      }
    }
    deliveryMethod {
      __typename
      ... on Warehouse {
        name
        id
      }
      ... on ShippingMethod {
        id
        name
        description
        price {
          currency
          amount
        }
      }
    }
  }
`
