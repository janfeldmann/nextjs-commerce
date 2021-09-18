import { useState } from 'react'
import type { GetStaticPropsContext } from 'next'
import { RadioGroup } from '@headlessui/react'
import useCart from '@framework/cart/use-cart'
import usePrice from '@framework/product/use-price'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Button, Text } from '@components/ui'
import { Bag, Cross, Check, CheckCircle, MapPin } from '@components/icons'
import { CartItem } from '@components/cart'
import Totals from '@components/checkout/Totals'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const paymentMethodsPromise = await fetch(
    'http://localhost:3000/api/payment/methods',
    {
      method: 'POST',
      // Example with amount and currency to only receive payment methods applicable for currency and amount, e. g. Giropay only accepts EUR as currency
      // body: JSON.stringify({ locale: 'de_DE', amount: '100.00', currency: 'USD' }),
      body: JSON.stringify({ locale: 'de_DE' }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  const { pages } = await pagesPromise
  const { categories, siteInfo } = await siteInfoPromise
  const { methods: paymentMethods } = await paymentMethodsPromise.json()

  return {
    props: {
      pages,
      categories,
      siteInfo,
      paymentMethods: paymentMethods?._embedded?.methods,
    },
  }
}

export default function Cart({ paymentMethods, siteInfo }: any) {
  const error = null
  const success = null
  const { data, isLoading, isEmpty } = useCart()
  const [selected, setSelected] = useState()

  const submitOrder = () => {}

  return (
    <div className="grid lg:grid-cols-12 w-full max-w-7xl mx-auto">
      <div className="lg:col-span-8">
        {isLoading || isEmpty ? (
          <div className="flex-1 px-12 py-24 flex flex-col justify-center items-center ">
            <span className="border border-dashed border-secondary flex items-center justify-center w-16 h-16 bg-primary p-12 rounded-lg text-primary">
              <Bag className="absolute" />
            </span>
            <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
              Your cart is empty
            </h2>
            <p className="text-accent-6 px-10 text-center pt-2">
              Biscuit oat cake wafer icing ice cream tiramisu pudding cupcake.
            </p>
          </div>
        ) : error ? (
          <div className="flex-1 px-4 flex flex-col justify-center items-center">
            <span className="border border-white rounded-full flex items-center justify-center w-16 h-16">
              <Cross width={24} height={24} />
            </span>
            <h2 className="pt-6 text-xl font-light text-center">
              We couldn’t process the purchase. Please check your card
              information and try again.
            </h2>
          </div>
        ) : success ? (
          <div className="flex-1 px-4 flex flex-col justify-center items-center">
            <span className="border border-white rounded-full flex items-center justify-center w-16 h-16">
              <Check />
            </span>
            <h2 className="pt-6 text-xl font-light text-center">
              Thank you for your order.
            </h2>
          </div>
        ) : (
          <div className="px-4 sm:px-6 flex-1">
            <Text variant="pageHeading">My Cart</Text>
            <Text variant="sectionHeading">Review your Order</Text>
            <ul className="py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-accent-2 border-b border-accent-2">
              {data!.lineItems.map((item: any) => (
                <CartItem
                  key={item.id}
                  item={item}
                  currencyCode={data?.currency.code!}
                />
              ))}
            </ul>
            <div className="my-6">
              <Text>
                Before you leave, take a look at these items. We picked them
                just for you
              </Text>
              <div className="flex py-6 space-x-6">
                {[1, 2, 3, 4, 5, 6].map((x) => (
                  <div
                    key={x}
                    className="border border-accent-3 w-full h-24 bg-accent-2 bg-opacity-50 transform cursor-pointer hover:scale-110 duration-75"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="lg:col-span-4">
        <div className="flex-shrink-0 px-4 py-24 sm:px-6">
          {process.env.COMMERCE_CUSTOMCHECKOUT_ENABLED && (
            <>
              {/* Shipping Address */}
              {/* Only available with customCheckout set to true - Meaning that the provider does offer checkout functionality. */}
              <div className="rounded-md border border-accent-2 px-6 py-6 mb-4 flex cursor-pointer hover:border-accent-4">
                <div className="mr-5">
                  <MapPin />
                </div>
                <div className="text-sm font-medium">
                  {data?.shippingAddress ? (
                    <>
                      <span className="block mb-2 font-bold text-lg">
                        Shipping Address
                      </span>
                      {data?.shippingAddress?.firstName}{' '}
                      {data?.shippingAddress?.lastName} <br />
                      {data?.shippingAddress?.streetAddress1}
                      <br />
                      {data?.shippingAddress?.postalCode}
                      <br />
                      {data?.shippingAddress?.city}
                      <br />
                      {data?.shippingAddress?.country?.code}
                      <br />
                    </>
                  ) : (
                    <span className="uppercase text-center ">
                      + Add Shipping Address
                    </span>
                  )}
                </div>
              </div>
              <div className="rounded-md border border-accent-2 px-6 py-6 mb-4 flex cursor-pointer hover:border-accent-4">
                <div className="mr-5">
                  <MapPin />
                </div>
                <div className="text-sm font-medium">
                  {data?.billingAddress && (
                    <>
                      <span className="block mb-2 font-bold text-lg">
                        Billing Address
                      </span>
                      {data?.billingAddress?.firstName}{' '}
                      {data?.billingAddress?.lastName} <br />
                      {data?.billingAddress?.streetAddress1}
                      <br />
                      {data?.billingAddress?.postalCode}
                      <br />
                      {data?.billingAddress?.city}
                      <br />
                      {data?.billingAddress?.country?.code}
                      <br />
                    </>
                  )}
                </div>
              </div>
              {/* Payment Method */}
              {/* Only available with customCheckout set to true - Meaning that the provider does offer checkout functionality. */}
              <div>
                <div className="text-sm font-medium my-8">
                  <RadioGroup value={selected} onChange={setSelected}>
                    <RadioGroup.Label className="block mb-4 font-bold text-lg">
                      Payment method
                    </RadioGroup.Label>
                    <div className="space-y-2">
                      {paymentMethods.map((method: any) => (
                        <RadioGroup.Option
                          key={method.id}
                          value={method}
                          className={({ active, checked }) =>
                            `${
                              active
                                ? 'ring-2 ring-offset-2 ing-offset-sky-300 ring-white ring-opacity-60'
                                : ''
                            }
                  ${
                    checked
                      ? 'bg-sky-900  border-purple-900 bg-opacity-75 text-gray-900'
                      : 'bg-white'
                  }
                    relative border hover:border-purple-300 transition rounded-md px-5 py-4 cursor-pointer flex focus:outline-none`
                          }
                        >
                          {({ active, checked }) => (
                            <>
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                  <RadioGroup.Label
                                    as="span"
                                    className={`flex items-center  ${
                                      checked
                                        ? 'text-gray-900'
                                        : 'text-gray-900'
                                    }`}
                                  >
                                    <span className="mr-4">
                                      <img src={method.image.svg} />
                                    </span>
                                    {method.description}
                                  </RadioGroup.Label>
                                </div>
                                {checked && (
                                  <div className="flex-shrink-0 text-purple-900">
                                    <CheckCircle className="w-6 h-6" />
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </>
          )}
          <div className="border-t border-accent-2">
            <Totals siteInfo={siteInfo} />
          </div>
          <div className="flex flex-row justify-end">
            <div className="w-full lg:w-72">
              {isEmpty ? (
                <Button href="/" Component="a" width="100%">
                  Continue Shopping
                </Button>
              ) : (
                <Button width="100%" onClick={submitOrder}>
                  Order now
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Cart.Layout = Layout
