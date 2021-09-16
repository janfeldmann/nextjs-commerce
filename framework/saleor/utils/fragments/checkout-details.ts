import { DeliveryDetails } from './delivery-details'

export const CheckoutDetails = /* GraphQL */ `
  fragment CheckoutDetails on Checkout {
    id
    token
    created
    billingAddress {
      id
      firstName
      lastName
      companyName
      streetAddress1
      streetAddress2
      city
      cityArea
      postalCode
      country {
        code
      }
      countryArea
      isDefaultBillingAddress
      isDefaultShippingAddress
      phone
    }
    shippingAddress {
      id
      firstName
      lastName
      companyName
      streetAddress1
      streetAddress2
      city
      cityArea
      postalCode
      country {
        code
      }
      countryArea
      isDefaultBillingAddress
      isDefaultShippingAddress
      phone
    }
    totalPrice {
      currency
      gross {
        amount
      }
    }
    subtotalPrice {
      currency
      gross {
        amount
      }
    }
    lines {
      id
      variant {
        id
        name
        sku
        product {
          name
          slug
        }
        media {
          url
        }
        pricing {
          price {
            gross {
              amount
            }
          }
        }
      }
      quantity
      totalPrice {
        currency
        gross {
          amount
        }
      }
    }
    ...DeliveryDetails
  }
  ${DeliveryDetails}
`
