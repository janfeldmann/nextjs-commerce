import { handler as useCart } from './cart/use-cart'
import { handler as useAddItem } from './cart/use-add-item'
import { handler as useUpdateItem } from './cart/use-update-item'
import { handler as useUpdateDeliveryMethod } from './cart/use-checkout-delivery-method-update'
import { handler as useUpdateBillingAddress } from './cart/use-checkout-billing-address-update'
import { handler as useUpdateShippingAddress } from './cart/use-checkout-shipping-address-update'
import { handler as usePayment } from './cart/use-checkout-payment-create'
import { handler as useCheckoutComplete } from './cart/use-checkout-complete'
import { handler as useRemoveItem } from './cart/use-remove-item'

import { handler as useCustomer } from './customer/use-customer'
import { handler as useSearch } from './product/use-search'

import { handler as useLogin } from './auth/use-login'
import { handler as useLogout } from './auth/use-logout'
import { handler as useSignup } from './auth/use-signup'

import fetcher from './fetcher'

export const saleorProvider = {
  locale: 'en-us',
  cartCookie: '',
  cartCookieToken: '',
  fetcher,
  cart: {
    useCart,
    useAddItem,
    useUpdateItem,
    useRemoveItem,
    useUpdateDeliveryMethod,
    useUpdateBillingAddress,
    useUpdateShippingAddress,
    usePayment,
    useCheckoutComplete,
  },
  customer: { useCustomer },
  products: { useSearch },
  auth: { useLogin, useLogout, useSignup },
}

export type SaleorProvider = typeof saleorProvider
