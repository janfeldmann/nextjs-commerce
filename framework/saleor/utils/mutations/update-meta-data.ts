export const UpdateMetadata = /* GraphQl */ `
  mutation UpdateMetadata($id: ID!, $input: [MetadataInput!]!) {
    updateMetadata(
      id: $id
      input: $input
    ) {
      item {
        metadata {
          key
          value
        }
      }
      errors {
        code
        field
        message
      }
    }
  }
`
