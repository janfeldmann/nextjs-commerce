import cn from 'classnames'
import Link from 'next/link'
import { FC } from 'react'
import CartItem from '@components/cart/CartItem'
import { Button, Text } from '@components/ui'
import { useUI } from '@components/ui/context'
import useCart from '@framework/cart/use-cart'
import usePrice from '@framework/product/use-price'
import ShippingWidget from '../ShippingWidget'
import PaymentWidget from '../PaymentWidget'
import SidebarLayout from '@components/common/SidebarLayout'
import useDeliveryMethodUpdate from '@framework/cart/use-checkout-delivery-method-update'
import s from './CheckoutSidebarView.module.css'
import Totals from '@components/checkout/Totals'

const CheckoutSidebarView: FC = () => {
  const { setSidebarView } = useUI()
  const { data } = useCart()
  const deliveryMethodUpdate = useDeliveryMethodUpdate()

  const handleSetDeliveryMethod = async (methodId: string) => {
    if (data?.shippingAddress) {
      try {
        console.log('UPDATE DELIVERY METHOD!')
        await deliveryMethodUpdate({
          deliveryMethodId: methodId,
        })
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <SidebarLayout
      className={s.root}
      handleBack={() => setSidebarView('CART_VIEW')}
    >
      <div className="px-4 sm:px-6 flex-1">
        <Link href="/cart">
          <Text variant="sectionHeading">Checkout</Text>
        </Link>

        {data?.deliveryMethod && (
          <PaymentWidget onClick={() => setSidebarView('PAYMENT_VIEW')} />
        )}

        <ShippingWidget onClick={() => setSidebarView('SHIPPING_VIEW')} />

        <ul className={s.lineItemsList}>
          {data!.lineItems.map((item: any) => (
            <CartItem
              key={item.id}
              item={item}
              currencyCode={data!.currency.code}
              variant="display"
            />
          ))}
        </ul>
      </div>

      {data?.availableShippingMethods && (
        <div className="p-6 flex flex-col">
          <p className="mb-2 font-bold">Choose a shipping method</p>
          {data?.availableShippingMethods?.map((method) => {
            return (
              <label className="mb-2">
                <input
                  type="radio"
                  className="mr-2"
                  id={method.id}
                  onChange={(e) => handleSetDeliveryMethod(method.id)}
                  name="shipping-methods"
                  checked={data?.deliveryMethod?.id === method?.id}
                />
                {method.name}
              </label>
            )
          })}
        </div>
      )}

      <div className="flex-shrink-0 px-6 py-6 sm:px-6 sticky z-20 bottom-0 w-full right-0 left-0 bg-accent-0 border-t text-sm">
        <Totals />
        <div>
          {/* Once data is correcly filled */}
          {/* <Button Component="a" width="100%">
                Confirm Purchase
              </Button> */}
          <Button Component="a" width="100%" variant="ghost" disabled>
            Continue
          </Button>
        </div>
      </div>
    </SidebarLayout>
  )
}

export default CheckoutSidebarView
