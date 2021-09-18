import { useCallback } from 'react'
import debounce from 'lodash.debounce'
import type { Provider } from '@commerce'
import { useHook, useMutationHook } from '@commerce/utils/use-hook'
import { mutationFetcher } from '@commerce/utils/default-fetcher'
import type { HookFetcherFn, HookFetcherContext, MutationHook, MutationHookContext } from '@commerce/utils/types'
import { ValidationError } from '@commerce/utils/errors'
import { updateMetadata } from '../utils'
import { getCheckoutId } from '../utils'
import { Mutation, MutationCheckoutPaymentCreateArgs, PaymentInput } from '../schema'

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
  async fetcher({
    input: { gateway, amount, metadata, redirectUrl },
    options,
    fetch,
  }: HookFetcherContext<CreatePaymentHook>) {
    const checkoutToken = getCheckoutId().checkoutToken

    const { checkoutPaymentCreate } = await fetch<Mutation, MutationCheckoutPaymentCreateArgs>({
      ...options,
      variables: {
        token: checkoutToken,
        gateway,
        amount,
      },
    })

    if (metadata) {
      await updateMetadata(fetch, checkoutPaymentCreate?.checkout?.id, metadata)
    }

    if (typeof window !== undefined && redirectUrl) {
      window.location.href = redirectUrl
    }

    return checkoutPaymentCreate
  },
  useHook:
    ({ fetch }: MutationHookContext<CreatePaymentHook>) =>
    <T extends PaymentInput | undefined = undefined>(
      ctx: {
        amount?: T
        gateway?: T
        metadata?: T
        redirectUrl?: string
        wait?: number
      } = {}
    ) => {
      const {
        amount: amountFromContext,
        gateway: gatewayFromContext,
        metadata: metadataFromContext,
        redirectUrl: redirectUrlFromContext,
      } = ctx

      return useCallback(
        debounce(
          async (input: {
            amount: PaymentInput['amount']
            gateway: PaymentInput['gateway']
            metadata: PaymentInput['gateway']
            redirectUrl: string
          }) => {
            const amount = input.amount ?? amountFromContext
            const gateway = input.gateway ?? gatewayFromContext
            const metadata = input.metadata ?? metadataFromContext
            const redirectUrl = input.redirectUrl ?? redirectUrlFromContext

            if (!amount || !gateway) {
              throw new ValidationError({
                message: 'Invalid input used for this operation',
              })
            }

            await fetch({
              input: {
                gateway,
                amount,
                metadata,
                redirectUrl,
              },
            })

            return null
          },
          ctx.wait ?? 500
        ),
        [fetch]
      )
    },
}
