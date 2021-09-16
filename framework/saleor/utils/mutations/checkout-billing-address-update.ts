import * as fragment from '../fragments'

export const CheckoutBillingAddressUpdate = /* GraphQL */ `
  mutation CheckoutBillingAddressUpdate($token: UUID!, $billingAddress: AddressInput!) {
    checkoutBillingAddressUpdate(token: $token, billingAddress: $billingAddress) {
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
