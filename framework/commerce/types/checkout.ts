import { MetadataInput, Order, PaymentInput } from '@framework/schema'

export type CheckoutCompleteHook = {
  data: { order: Order } | null
  input: { wait?: number }
  fetcherInput: {}
  body: {}
  actionInput: {}
}

export type CreatePaymentHook = {
  data: {
    amount?: PaymentInput['amount']
    gateway?: PaymentInput['gateway']
    metadata?: PaymentInput['metadata']
    redirectUrl?: string
  } | null
  input: {
    amount?: PaymentInput['amount']
    gateway?: PaymentInput['gateway']
    metadata?: PaymentInput['metadata']
    redirectUrl?: string
    wait?: number
  }
  fetcherInput: {
    amount?: PaymentInput['amount']
    gateway?: PaymentInput['gateway']
    metadata?: PaymentInput['metadata']
    redirectUrl?: string
  }
  body: { amount?: PaymentInput['amount']; gateway?: PaymentInput['gateway'] }
  actionInput: {
    amount?: PaymentInput['amount']
    gateway?: PaymentInput['gateway']
    metadata?: PaymentInput['metadata']
    redirectUrl?: string
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
