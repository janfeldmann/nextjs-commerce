export const CheckoutComplete = /* GraphQL */ `
  mutation CheckoutComplete($token: UUID!) {
    checkoutComplete(token: $token) {
      order {
        id
        status
        redirectUrl
      }
      errors {
        code
        field
        message
      }
    }
  }
`
