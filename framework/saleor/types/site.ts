import { Category } from '@commerce/types/site'

export type SiteInfo = {
  chargeTaxesOnShipping?: Boolean
  includeTaxesInPrices?: Boolean
}

/**
 * Extend core cart types
 */
export interface GetSiteInfoResult {
  categories: Category[]
  brands: any[]
  siteInfo: SiteInfo
}
