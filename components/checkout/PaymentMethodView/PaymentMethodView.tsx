import { FC, useEffect } from 'react'
import cn from 'classnames'
import { Button, Text } from '@components/ui'
import { useUI } from '@components/ui/context'
import s from './PaymentMethodView.module.css'
import SidebarLayout from '@components/common/SidebarLayout'
import useCart from '@framework/cart/use-cart'
import useCheckoutPaymentCreate from '@framework/cart/use-checkout-payment-create'

const PaymentMethodView: FC = () => {
  const { setSidebarView } = useUI()
  const { data: checkoutData } = useCart()
  const createPayment = useCheckoutPaymentCreate()

  const handleCreatePayment = async () => {
    // Payload for creating paymentinside payment service provider system (PSP)
    const payload = {
      amount: {
        currency: checkoutData?.currency?.code,
        value: checkoutData?.totalPrice.toFixed(2), // Mollie needs two decimal places --> TODO: move check to mollie
      },
      description: 'Payment description', // TODO: Make dynamic
      redirectUrl: 'http://localhost:3000/checkout/success', // TODO: Move to global config
      locale: 'de_DE', // TODO: Make dynamic
      method: 'paypal', // TODO: Make dynamic
    }

    // Create payment inside PSP
    const response = await fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const payment = await response.json()

    // Create payment inside shop provider system
    await createPayment({
      amount: checkoutData?.totalPrice,
      gateway: 'mirumee.payments.mollie',
      metadata: payment?.metadata,
      redirectUrl: payment?.redirectUrl,
    })
  }

  useEffect(() => {
    console.log('CHECKOUT DATA!', checkoutData)
  }, [checkoutData])

  return (
    <SidebarLayout handleBack={() => setSidebarView('CHECKOUT_VIEW')}>
      <div className="px-4 sm:px-6 flex-1">
        <Text variant="sectionHeading"> Payment Method</Text>
        <div>
          <div className={s.fieldset}>
            <label className={s.label}>Cardholder Name</label>
            <input className={s.input} />
          </div>
          <div className="grid gap-3 grid-flow-row grid-cols-12">
            <div className={cn(s.fieldset, 'col-span-7')}>
              <label className={s.label}>Card Number</label>
              <input className={s.input} />
            </div>
            <div className={cn(s.fieldset, 'col-span-3')}>
              <label className={s.label}>Expires</label>
              <input className={s.input} placeholder="MM/YY" />
            </div>
            <div className={cn(s.fieldset, 'col-span-2')}>
              <label className={s.label}>CVC</label>
              <input className={s.input} />
            </div>
          </div>
          <hr className="border-accent-2 my-6" />
          <div className="grid gap-3 grid-flow-row grid-cols-12">
            <div className={cn(s.fieldset, 'col-span-6')}>
              <label className={s.label}>First Name</label>
              <input className={s.input} />
            </div>
            <div className={cn(s.fieldset, 'col-span-6')}>
              <label className={s.label}>Last Name</label>
              <input className={s.input} />
            </div>
          </div>
          <div className={s.fieldset}>
            <label className={s.label}>Company (Optional)</label>
            <input className={s.input} />
          </div>
          <div className={s.fieldset}>
            <label className={s.label}>Street and House Number</label>
            <input className={s.input} />
          </div>
          <div className={s.fieldset}>
            <label className={s.label}>Apartment, Suite, Etc. (Optional)</label>
            <input className={s.input} />
          </div>
          <div className="grid gap-3 grid-flow-row grid-cols-12">
            <div className={cn(s.fieldset, 'col-span-6')}>
              <label className={s.label}>Postal Code</label>
              <input className={s.input} />
            </div>
            <div className={cn(s.fieldset, 'col-span-6')}>
              <label className={s.label}>City</label>
              <input className={s.input} />
            </div>
          </div>
          <div className={s.fieldset}>
            <label className={s.label}>Country/Region</label>
            <select className={s.select}>
              <option>Hong Kong</option>
            </select>
          </div>
        </div>
      </div>
      <div className="sticky z-20 bottom-0 w-full right-0 left-0 py-12 bg-accent-0 border-t border-accent-2 px-6">
        <Button
          onClick={handleCreatePayment}
          Component="a"
          width="100%"
          variant="ghost"
        >
          Continue
        </Button>
      </div>
    </SidebarLayout>
  )
}

export default PaymentMethodView
