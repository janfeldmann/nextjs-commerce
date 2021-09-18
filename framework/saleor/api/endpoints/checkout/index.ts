import { CommerceAPI, GetAPISchema, createEndpoint } from '@commerce/api'
import checkoutEndpoint from '@commerce/api/endpoints/checkout'
import { CheckoutSchema } from '@commerce/types/checkout'
import { createPayment } from '@lib/api/payment/mollie'

export type CheckoutAPI = GetAPISchema<CommerceAPI, CheckoutSchema>

export type CheckoutEndpoint = CheckoutAPI['endpoint']

const checkout: CheckoutEndpoint['handlers']['checkout'] = async ({ req, res, config }) => {
  const body = req.body

  try {
    const response = await createPayment(body)

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

export const handlers: CheckoutEndpoint['handlers'] = { checkout }

const checkoutApi = createEndpoint<CheckoutAPI>({
  handler: checkoutEndpoint,
  handlers,
})

export default checkoutApi
