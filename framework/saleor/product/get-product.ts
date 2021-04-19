import { GraphQLFetcherResult } from '@commerce/api'
import { getConfig, SaleorConfig } from '../api'
import { normalizeProduct, getProductQuery } from '../utils'

type Variables = {
  slug: string
}

type ReturnType = {
  product: any
}

const getProduct = async (options: {
  variables: Variables
  config: SaleorConfig
  preview?: boolean
}): Promise<ReturnType> => {
  let { config, variables } = options ?? {}
  config = getConfig(config)

  const { data }: GraphQLFetcherResult = await config.fetch(getProductQuery, {
    variables,
  })

  const { product } = data

  return {
    product: product ? normalizeProduct(product) : null,
  }
}

export default getProduct