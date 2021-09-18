import { FC } from 'react'
import useCart from '@framework/cart/use-cart'
import usePrice from '@framework/product/use-price'

interface Props {
  siteInfo: any
}

const Totals: FC<Props> = ({ siteInfo }) => {
  const { data } = useCart()
  let siteInfoData = siteInfo

  const { price: subTotal } = usePrice(
    data && {
      amount: Number(data.subtotalPrice?.gross?.amount),
      currencyCode: data.currency.code,
    }
  )

  const { price: subTotalTax } = usePrice(
    data && {
      amount: Number(data.subtotalPrice?.tax?.amount),
      currencyCode: data.currency.code,
    }
  )

  const { price: total } = usePrice(
    data && {
      amount: Number(data.totalPrice?.gross?.amount),
      currencyCode: data.currency.code,
    }
  )

  const { price: totalTax } = usePrice(
    data && {
      amount: Number(data.totalPrice?.tax?.amount),
      currencyCode: data.currency.code,
    }
  )

  const { price: shipping } = usePrice(
    data && {
      amount: Number(data?.shippingPrice?.gross?.amount),
      currencyCode: data.currency.code,
    }
  )

  const { price: shippingTax } = usePrice(
    data && {
      amount: Number(data?.shippingPrice?.tax?.amount),
      currencyCode: data.currency.code,
    }
  )

  if (!siteInfoData) {
    siteInfoData = { includeTaxesInPrices: true, chargeTaxesOnShipping: true } // TODO: Find a way to add siteinfo from page data here
  }

  return (
    <div className="totals">
      <ul className="py-3">
        <li className="flex flex-wrap justify-between py-1">
          <span>
            Subtotal{' '}
            {siteInfoData?.includeTaxesInPrices
              ? '(incl. taxes)'
              : '(excl. taxes)'}
          </span>
          <span>{subTotal}</span>
          <div className="w-full pt-1 pl-4 text-gray-500 text-sm">
            <ul>
              <li className="flex justify-between py-0.5">
                <span>Taxes</span>
                <span>{subTotalTax}</span>
              </li>
            </ul>
          </div>
        </li>
        <li className="flex flex-wrap justify-between py-1">
          <span>
            Estimated Shipping{' '}
            {siteInfoData?.chargeTaxesOnShipping
              ? '(incl. taxes)'
              : '(tax free)'}
          </span>
          <span className="font-bold tracking-wide">
            {shipping ? <>{shipping}</> : '-'}
          </span>
          {siteInfoData?.chargeTaxesOnShipping && (
            <div className="w-full pt-1 pl-4 text-gray-500 text-sm">
              <ul>
                <li className="flex justify-between py-0.5">
                  <span>Taxes</span>
                  <span>{shippingTax}</span>
                </li>
              </ul>
            </div>
          )}
        </li>
        <li className="flex justify-between py-1">
          <span>Taxes </span>
          <span>{totalTax}</span>
        </li>
      </ul>
      <div className="flex justify-between border-t border-accent-2 py-3 font-bold mb-10">
        <span>Total</span>
        <span>{total}</span>
      </div>
    </div>
  )
}

export default Totals
