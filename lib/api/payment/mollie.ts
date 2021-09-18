export const createPayment = async (payload: any) => {
  const response = await fetch('https://api.mollie.com/v2/payments', {
    method: 'post',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer test_zkUA7p4QE7ga9urrGSg8WNJV38R6HE',
    },
  })
  const paymentResponse = await response.json()
  const metadata = []

  console.log('MOLLIE', paymentResponse)

  if (paymentResponse?._links?.dashboard?.href) {
    metadata.push({
      key: 'payment_provider_details_url',
      value: paymentResponse?._links?.dashboard?.href,
    })
  }

  if (paymentResponse?.method) {
    metadata.push({ key: 'payment_method', value: paymentResponse?.method })
  }

  return {
    success: true,
    id: paymentResponse?.id,
    redirectUrl: paymentResponse?._links?.checkout?.href,
    metadata,
  }
}

export const getPaymentMethods = async ({
  locale,
  amount,
  currency,
}: {
  locale: string
  amount: string
  currency: string
}) => {
  const url = new URL('https://api.mollie.com/v2/methods')

  if (locale) {
    url.searchParams.append('locale', locale)
  }

  // Mollie only accepts these parameters if they are both set
  if (amount && currency) {
    url.searchParams.append('amount[value]', amount)
    url.searchParams.append('amount[currency]', currency)
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer test_zkUA7p4QE7ga9urrGSg8WNJV38R6HE',
    },
  })

  const paymentResponse = await response.json()

  return { success: true, methods: paymentResponse }
}

export default createPayment
