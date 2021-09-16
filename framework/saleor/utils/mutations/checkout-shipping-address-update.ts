import * as fragment from '../fragments'

export const CheckoutShippingAddressUpdate = /* GraphQL */ `
  mutation CheckoutShippingAddressUpdate($token: UUID!, $shippingAddress: AddressInput!) {
    checkoutShippingAddressUpdate(token: $token, shippingAddress: $shippingAddress) {
      checkout {
        ...CheckoutDetails
      }
      errors {
        code
        field
        message
      }
    }
  }
  ${fragment.CheckoutDetails}
`
