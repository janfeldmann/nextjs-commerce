import { CommerceAPI, GetAPISchema, createEndpoint } from '@commerce/api'
import paymentMethodsEndpoint from '@commerce/api/endpoints/paymentMethods'
import { PaymentMethodsSchema } from '@commerce/types/paymentMethods'
import { getPaymentMethods } from '@lib/api/payment/mollie'
export type CheckoutAPI = GetAPISchema<CommerceAPI, PaymentMethodsSchema>

export type CheckoutEndpoint = CheckoutAPI['endpoint']

const paymentMethods: CheckoutEndpoint['handlers']['paymentMethods'] = async ({ req, res, config }) => {
  try {
    const body = req.body
    const response = await getPaymentMethods(body)
    res.status(200)
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify(response))
    res.end()
  } catch (error) {
    console.error(error)

    const message = 'An unexpected error ocurred'

    res.status(500).json({ data: null, errors: [{ message }] })
  }
}

export const handlers: CheckoutEndpoint['handlers'] = { paymentMethods }

const paymentMethodsApi = createEndpoint<CheckoutAPI>({
  handler: paymentMethodsEndpoint,
  handlers,
})

export default paymentMethodsApi
