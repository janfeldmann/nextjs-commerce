import { useCallback } from 'react'
import debounce from 'lodash.debounce'
import type { Provider } from '@commerce'
import { useHook, useMutationHook } from '@commerce/utils/use-hook'
import { mutationFetcher } from '@commerce/utils/default-fetcher'
import type { HookFetcherFn, HookFetcherContext, MutationHook, MutationHookContext } from '@commerce/utils/types'
import { ValidationError } from '@commerce/utils/errors'

import useCart from './use-cart'
import type { UpdateBillingAddress } from '../types'
import { checkoutToCart } from '../utils'
import { getCheckoutId } from '../utils'
import { Mutation, MutationCheckoutPaymentCreateArgs, AddressInput, PaymentInput } from '../schema'

import * as mutation from '../utils/mutations'

import type { CreatePaymentHook } from '../types/cart'

export type UseCreatePayment<H extends MutationHook<any> = MutationHook<CreatePaymentHook>> = ReturnType<H['useHook']>

export const fetcher: HookFetcherFn<CreatePaymentHook> = mutationFetcher

const fn = (provider: Provider) => provider.checkout?.usePayment!

const UseCreatePayment: UseCreatePayment = (input) => {
  const hook = useHook(fn)

  return useMutationHook({ fetcher, ...hook })(input)
}

export default UseCreatePayment as UseCreatePayment<typeof handler>

export const handler = {
  fetchOptions: { query: mutation.CheckoutPaymentCreate },
  async fetcher({ input: { gateway, amount }, options, fetch }: HookFetcherContext<CreatePaymentHook>) {
    const checkoutToken = getCheckoutId().checkoutToken

    const { checkoutPaymentCreate } = await fetch<Mutation, MutationCheckoutPaymentCreateArgs>({
      ...options,
      variables: {
        token: checkoutToken,
        gateway,
        amount,
      },
    })

    console.log('checkoutPaymentCreate', checkoutPaymentCreate)

    return checkoutToCart(checkoutPaymentCreate)
  },
  useHook:
    ({ fetch }: MutationHookContext<CreatePaymentHook>) =>
    <T extends PaymentInput | undefined = undefined>(
      ctx: {
        amount?: T
        gateway?: T
        wait?: number
      } = {}
    ) => {
      const { amount: amountFromContext, gateway: gatewayFromContext } = ctx
      const { mutate } = useCart() as any

      return useCallback(
        debounce(async (input: PaymentInput) => {
          const amount = input.amount ?? amountFromContext
          const gateway = input.gateway ?? gatewayFromContext

          console.log('MAKE CALL!')

          if (!amount || !gateway) {
            throw new ValidationError({
              message: 'Invalid input used for this operation',
            })
          }

          const data = await fetch({
            input: {
              gateway,
              amount,
            },
          })

          console.log('Checkout payment data', data)

          await mutate(data, false)
          return null
        }, ctx.wait ?? 500),
        [fetch, mutate]
      )
    },
}
