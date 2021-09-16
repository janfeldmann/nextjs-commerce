import { CommerceAPI, GetAPISchema, createEndpoint } from '@commerce/api'
import checkoutEndpoint from '@commerce/api/endpoints/checkout'
import { CheckoutSchema } from '@commerce/types/checkout'

export type CheckoutAPI = GetAPISchema<CommerceAPI, CheckoutSchema>

export type CheckoutEndpoint = CheckoutAPI['endpoint']

const checkout: CheckoutEndpoint['handlers']['checkout'] = async ({ req, res, config }) => {
  try {
    const response = await fetch('https://api.mollie.com/v2/payments', {
      method: 'post',
      body: JSON.stringify({
        amount: { currency: 'EUR', value: '1.00' },
        description: 'the description',
        redirectUrl: 'http://localhost:3000/checkout/success',
        locale: 'de_DE',
        method: 'paypal',
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test_zkUA7p4QE7ga9urrGSg8WNJV38R6HE',
      },
    })

    const paymentResponse = await response.json()

    console.log(paymentResponse)

    // if (payment?._links?.checkout?.href) {
    //   window.location.href = payment._links.checkout.href
    // }

    res.status(200)
    res.setHeader('Content-Type', 'application/json')
    res.write(
      JSON.stringify({ success: true, id: paymentResponse?.id, redirect: paymentResponse?._links?.checkout?.href })
    )
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
