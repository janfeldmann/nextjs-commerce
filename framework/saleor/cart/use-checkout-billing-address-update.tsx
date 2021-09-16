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
import { Mutation, MutationCheckoutBillingAddressUpdateArgs, AddressInput } from '../schema'

import * as mutation from '../utils/mutations'

import type { UpdateBillingAddressHook } from '../types/cart'

export type UseUpdateBillingAddress<
  H extends MutationHook<UpdateBillingAddressHook> = MutationHook<UpdateBillingAddressHook>
> = ReturnType<H['useHook']>

export const fetcher: HookFetcherFn<UpdateBillingAddressHook> = mutationFetcher

export type UpdateItemActionInput<T = any> = T extends UpdateBillingAddress
  ? Partial<UpdateBillingAddressHook['actionInput']>
  : UpdateBillingAddressHook['actionInput']

const fn = (provider: Provider) => provider.cart?.useUpdateBillingAddress!

const UseUpdateBillingAddress: UseUpdateBillingAddress = (input) => {
  const hook = useHook(fn)

  return useMutationHook({ fetcher, ...hook })(input)
}

export default UseUpdateBillingAddress as UseUpdateBillingAddress<typeof handler>

export const handler = {
  fetchOptions: { query: mutation.CheckoutBillingAddressUpdate },
  async fetcher({ input: { billingAddress }, options, fetch }: HookFetcherContext<UpdateBillingAddressHook>) {
    const checkoutToken = getCheckoutId().checkoutToken

    const { checkoutBillingAddressUpdate } = await fetch<Mutation, MutationCheckoutBillingAddressUpdateArgs>({
      ...options,
      variables: {
        token: checkoutToken,
        billingAddress,
      },
    })

    return checkoutToCart(checkoutBillingAddressUpdate)
  },
  useHook:
    ({ fetch }: MutationHookContext<UpdateBillingAddressHook>) =>
    <T extends AddressInput | undefined = undefined>(
      ctx: {
        billingAddress?: T
        wait?: number
      } = {}
    ) => {
      const { billingAddress: billingAddressFromContext } = ctx
      const { mutate } = useCart() as any

      return useCallback(
        debounce(async (input: UpdateItemActionInput<T>) => {
          const billingAddress: AddressInput = input.billingAddress ?? billingAddressFromContext

          if (!billingAddress) {
            throw new ValidationError({
              message: 'Invalid input used for this operation',
            })
          }

          const data = await fetch({
            input: {
              billingAddress,
            },
          })

          await mutate(data, false)
          return null
        }, ctx.wait ?? 500),
        [fetch, mutate]
      )
    },
}
