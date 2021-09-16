import * as fragment from '../fragments'

export const CheckoutPaymentCreate = /* GraphQL */ `
  mutation CheckoutPaymentCreate($token: UUID!, $amount: PositiveDecimal!, $gateway: String!) {
    checkoutPaymentCreate(token: $token, input: { amount: $amount, gateway: $gateway }) {
      checkout {
        ...CheckoutDetails
      }
      payment {
        capturedAmount {
          currency
          amount
        }
        total {
          currency
          amount
        }
        chargeStatus
        id
        gateway
        paymentMethodType
        transactions {
          id
        }
        order {
          status
          redirectUrl
        }
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
