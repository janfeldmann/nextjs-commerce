import { useCallback } from 'react'
import debounce from 'lodash.debounce'
import type { Provider } from '@commerce'
import { useHook, useMutationHook } from '@commerce/utils/use-hook'
import { mutationFetcher } from '@commerce/utils/default-fetcher'
import type { HookFetcherFn, HookFetcherContext, MutationHook, MutationHookContext } from '@commerce/utils/types'
import { ValidationError } from '@commerce/utils/errors'

import useCart from './use-cart'
import type { UpdateShippingAddress } from '../types'
import { checkoutToCart } from '../utils'
import { getCheckoutId } from '../utils'
import { Mutation, MutationCheckoutShippingAddressUpdateArgs, AddressInput } from '../schema'

import * as mutation from '../utils/mutations'

import type { UpdateShippingAddressHook } from '../types/cart'

export type UseUpdateShippingAddress<
  H extends MutationHook<UpdateShippingAddressHook> = MutationHook<UpdateShippingAddressHook>
> = ReturnType<H['useHook']>

export const fetcher: HookFetcherFn<UpdateShippingAddressHook> = mutationFetcher

export type UpdateItemActionInput<T = any> = T extends UpdateShippingAddress
  ? Partial<UpdateShippingAddressHook['actionInput']>
  : UpdateShippingAddressHook['actionInput']

const fn = (provider: Provider) => provider.cart?.useUpdateShippingAddress!

const UseUpdateShippingAddress: UseUpdateShippingAddress = (input) => {
  const hook = useHook(fn)

  return useMutationHook({ fetcher, ...hook })(input)
}

export default UseUpdateShippingAddress as UseUpdateShippingAddress<typeof handler>

export const handler = {
  fetchOptions: { query: mutation.CheckoutShippingAddressUpdate },
  async fetcher({ input: { shippingAddress }, options, fetch }: HookFetcherContext<UpdateShippingAddressHook>) {
    const checkoutToken = getCheckoutId().checkoutToken

    const { checkoutShippingAddressUpdate } = await fetch<Mutation, MutationCheckoutShippingAddressUpdateArgs>({
      ...options,
      variables: {
        token: checkoutToken,
        shippingAddress,
      },
    })

    return checkoutToCart(checkoutShippingAddressUpdate)
  },
  useHook:
    ({ fetch }: MutationHookContext<UpdateShippingAddressHook>) =>
    <T extends AddressInput | undefined = undefined>(
      ctx: {
        shippingAddress?: T
        wait?: number
      } = {}
    ) => {
      const { shippingAddress: shippingAddressFromContext } = ctx
      const { mutate } = useCart() as any

      return useCallback(
        debounce(async (input: UpdateItemActionInput<T>) => {
          const shippingAddress: AddressInput = input.shippingAddress ?? shippingAddressFromContext

          if (!shippingAddress) {
            throw new ValidationError({
              message: 'Invalid input used for this operation',
            })
          }

          const data = await fetch({
            input: {
              shippingAddress,
            },
          })

          await mutate(data, false)
          return null
        }, ctx.wait ?? 500),
        [fetch, mutate]
      )
    },
}
