import { useCallback } from 'react'
import debounce from 'lodash.debounce'
import type { Provider } from '@commerce'
import { useHook, useMutationHook } from '@commerce/utils/use-hook'
import { mutationFetcher } from '@commerce/utils/default-fetcher'
import type { HookFetcherFn, HookFetcherContext, MutationHook, MutationHookContext } from '@commerce/utils/types'

import useCart from './use-cart'
import { checkoutToCart, checkoutCreate } from '../utils'
import { getCheckoutId } from '../utils'
import { Mutation, MutationCheckoutCompleteArgs, Order } from '../schema'

import * as mutation from '../utils/mutations'

import type { CheckoutCompleteHook } from '@commerce/types/checkout'

export type UseCheckoutComplete<H extends MutationHook<any> = MutationHook<CheckoutCompleteHook>> = ReturnType<
  H['useHook']
>

export const fetcher: HookFetcherFn<CheckoutCompleteHook> = mutationFetcher

const fn = (provider: Provider) => {
  console.log(provider)
  return provider.checkout?.useCheckoutComplete!
}

const UseCheckoutComplete: UseCheckoutComplete = (input) => {
  const hook = useHook(fn)

  return useMutationHook({ fetcher, ...hook })(input)
}

export default UseCheckoutComplete as UseCheckoutComplete<typeof handler>

export const handler = {
  fetchOptions: { query: mutation.CheckoutComplete },
  async fetcher({ options, fetch }: HookFetcherContext<CheckoutCompleteHook>) {
    const checkoutToken = getCheckoutId().checkoutToken

    const { checkoutComplete } = await fetch<Mutation, MutationCheckoutCompleteArgs>({
      ...options,
      variables: {
        token: checkoutToken,
      },
    })

    console.log('checkoutComplete!!', checkoutComplete)

    if (checkoutComplete?.errors?.length) {
      return null
    }

    return { order: checkoutComplete?.order }
  },
  useHook:
    ({ fetch }: MutationHookContext<CheckoutCompleteHook>) =>
    (
      ctx: {
        wait?: number
      } = {}
    ) => {
      const { mutate } = useCart() as any

      return useCallback(
        debounce(async () => {
          const data = await fetch()

          await mutate(data, false)
          return null
        }, ctx.wait ?? 500),
        [fetch, mutate]
      )
    },
}
