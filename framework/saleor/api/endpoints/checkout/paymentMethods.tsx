import { CommerceAPI, GetAPISchema, createEndpoint } from '@commerce/api'
import paymentMethodsEndpoint from '@commerce/api/endpoints/paymentMethods'
import { PaymentMethodsSchema } from '@commerce/types/paymentMethods'

export type CheckoutAPI = GetAPISchema<CommerceAPI, PaymentMethodsSchema>

export type CheckoutEndpoint = CheckoutAPI['endpoint']

const paymentMethods: CheckoutEndpoint['handlers']['paymentMethods'] = async ({ req, res, config }) => {
  try {
    const response = await fetch('https://api.mollie.com/v2/methods?locale=de_DE', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test_zkUA7p4QE7ga9urrGSg8WNJV38R6HE',
      },
    })

    const paymentResponse = await response.json()

    res.status(200)
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ success: true, methods: paymentResponse }))
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
