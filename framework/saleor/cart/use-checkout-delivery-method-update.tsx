import { useCallback } from 'react'
import debounce from 'lodash.debounce'
import type { Provider } from '@commerce'
import { useHook, useMutationHook } from '@commerce/utils/use-hook'
import { mutationFetcher } from '@commerce/utils/default-fetcher'
import type { HookFetcherFn, HookFetcherContext, MutationHook, MutationHookContext } from '@commerce/utils/types'
import { ValidationError } from '@commerce/utils/errors'

import useCart from './use-cart'
import type { UpdateDelivery } from '../types'
import { checkoutToCart } from '../utils'
import { getCheckoutId } from '../utils'
import { Mutation, MutationCheckoutDeliveryMethodUpdateArgs } from '../schema'

import * as mutation from '../utils/mutations'

import type { UpdateDeliveryHook } from '../types/cart'

export type UseUpdateDelivery<H extends MutationHook<UpdateDeliveryHook> = MutationHook<UpdateDeliveryHook>> =
  ReturnType<H['useHook']>

export const fetcher: HookFetcherFn<UpdateDeliveryHook> = mutationFetcher

export type UpdateItemActionInput<T = any> = T extends UpdateDelivery
  ? Partial<UpdateDeliveryHook['actionInput']>
  : UpdateDeliveryHook['actionInput']

const fn = (provider: Provider) => provider.cart?.useUpdateDeliveryMethod!

const UseUpdateDelivery: UseUpdateDelivery = (input) => {
  const hook = useHook(fn)

  return useMutationHook({ fetcher, ...hook })(input)
}

export default UseUpdateDelivery as UseUpdateDelivery<typeof handler>

export const handler = {
  fetchOptions: { query: mutation.CheckoutDeliveryMethodUpdate },
  async fetcher({ input: { deliveryMethodId }, options, fetch }: HookFetcherContext<UpdateDeliveryHook>) {
    const checkoutToken = getCheckoutId().checkoutToken

    const { checkoutDeliveryMethodUpdate } = await fetch<Mutation, MutationCheckoutDeliveryMethodUpdateArgs>({
      ...options,
      variables: {
        token: checkoutToken,
        deliveryMethodId,
      },
    })

    return checkoutToCart(checkoutDeliveryMethodUpdate)
  },
  useHook:
    ({ fetch }: MutationHookContext<UpdateDeliveryHook>) =>
    <T extends string | undefined = undefined>(
      ctx: {
        deliveryMethodId?: T
        wait?: number
      } = {}
    ) => {
      const { deliveryMethodId } = ctx
      const { mutate } = useCart() as any

      return useCallback(
        debounce(async (input: UpdateItemActionInput<T>) => {
          const id = input.deliveryMethodId ?? deliveryMethodId

          if (!id) {
            throw new ValidationError({
              message: 'Invalid input used for this operation' + id,
            })
          }

          const data = await fetch({
            input: {
              deliveryMethodId: String(id),
            },
          })

          await mutate(data, false)
          return null
        }, ctx.wait ?? 500),
        [fetch, mutate]
      )
    },
}
