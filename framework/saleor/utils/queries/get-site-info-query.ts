export const getSiteInfoQuery = /* GraphQL */ `
  query getSiteInfo {
    shop {
      name
      includeTaxesInPrices
      chargeTaxesOnShipping
      defaultCountry {
        code
        vat {
          standardRate
        }
      }
    }
  }
`
