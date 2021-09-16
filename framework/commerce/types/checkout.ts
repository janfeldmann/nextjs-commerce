import { Order, PaymentInput } from '@framework/schema'

export type CheckoutCompleteHook = {
  data: { order: Order } | null
  input: { wait?: number }
  fetcherInput: {}
  body: {}
  actionInput: {}
}

export type CreatePaymentHook = {
  data: PaymentInput | null
  input: {
    amount?: PaymentInput['amount']
    gateway?: PaymentInput['gateway']
    wait?: number
  }
  fetcherInput: {
    amount?: PaymentInput['amount']
    gateway?: PaymentInput['gateway']
  }
  body: { amount?: PaymentInput['amount']; gateway?: PaymentInput['gateway'] }
  actionInput: {
    amount?: PaymentInput['amount']
    gateway?: PaymentInput['gateway']
  }
}

export type CheckoutSchema = {
  endpoint: {
    options: {}
    handlers: {
      checkout: {
        data: null
      }
    }
  }
}
