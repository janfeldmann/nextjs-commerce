import { SiteInfo } from '@framework/types/site'
import { SaleorConfig } from '../api'
import * as query from './queries'

const getSiteInfo = async (config: SaleorConfig): Promise<SiteInfo> => {
  const { data } = await config.fetch(query.getSiteInfoQuery)

  return data.shop ?? null
}

export default getSiteInfo
