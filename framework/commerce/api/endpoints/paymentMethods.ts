import type { PaymentMethodsSchema } from '../../types/paymentMethods'
import { CommerceAPIError } from '../utils/errors'
import isAllowedOperation from '../utils/is-allowed-operation'
import type { GetAPISchema } from '..'

const paymentMethodsEndpoint: GetAPISchema<
  any,
  PaymentMethodsSchema
>['endpoint']['handler'] = async (ctx) => {
  const { req, res, handlers } = ctx

  if (
    !isAllowedOperation(req, res, {
      GET: handlers['paymentMethods'],
    })
  ) {
    return
  }

  try {
    const body = null
    return await handlers['paymentMethods']({ ...ctx, body })
  } catch (error) {
    console.error(error)

    const message =
      error instanceof CommerceAPIError
        ? 'An unexpected error ocurred with the Commerce API'
        : 'An unexpected error ocurred'

    res.status(500).json({ data: null, errors: [{ message }] })
  }
}

export default paymentMethodsEndpoint
