import * as fragment from '../fragments'

export const CheckoutDeliveryMethodUpdate = /* GraphQL */ `
  mutation CheckoutDeliveryMethodUpdate($token: UUID!, $deliveryMethodId: ID!) {
    checkoutDeliveryMethodUpdate(token: $token, deliveryMethodId: $deliveryMethodId) {
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
