import * as mutation from './mutations'
import { MetadataInput, UpdateMetadata } from '../schema'

export const updateMetadata = async (
  fetch: any,
  id?: string,
  metadata?: [MetadataInput]
): Promise<UpdateMetadata | null> => {
  if (!id || !metadata) return null

  const data = await fetch({
    query: mutation.UpdateMetadata,
    variables: {
      id,
      input: metadata,
    },
  })

  return data.updateMetadata
}

export default updateMetadata
