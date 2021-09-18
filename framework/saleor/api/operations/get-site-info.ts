import type { OperationContext } from '@commerce/api/operations'
import { GetSiteInfoResult } from '@framework/types/site'
import type { SaleorConfig, Provider } from '..'

import { getCategories, getVendors, getSiteInfo } from '../../utils'

export default function getSiteInfoOperation({ commerce }: OperationContext<Provider>) {
  async function getSiteInfoOperation({
    query,
    config,
    variables,
  }: {
    query?: string
    config?: Partial<SaleorConfig>
    preview?: boolean
    variables?: any
  } = {}): Promise<GetSiteInfoResult> {
    const cfg = commerce.getConfig(config)
    const categories = await getCategories(cfg)
    const brands = await getVendors(cfg)
    const siteInfo = await getSiteInfo(cfg)

    return {
      categories,
      brands,
      siteInfo,
    }
  }

  return getSiteInfoOperation
}
