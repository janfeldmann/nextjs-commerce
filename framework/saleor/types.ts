import type { Cart as CoreCart } from '@commerce/types'
import { AddressInput, Address, CheckoutLine, ShippingMethod, CollectionPoint, Order, Payment } from './schema'

export type SaleorCheckout = {
  id: string
  webUrl: string
  lineItems: CheckoutLine[]
}

export type Cart = CoreCart.Cart & {
  lineItems: LineItem[]
  billingAddress?: Address
  shippingAddress?: Address
  deliveryMethod?: ShippingMethod | CollectionPoint
  availableShippingMethods?: [ShippingMethod]
  availableCollectionPoints?: [CollectionPoint]
  payment?: Payment
  order?: Order
}

export interface LineItem extends CoreCart.LineItem {
  options?: any[]
}
export interface UpdateDelivery {
  deliveryMethodId: string
}
export interface UpdateBillingAddress {
  billingAddress: AddressInput
}
export interface UpdateShippingAddress {
  shippingAddress: AddressInput
}

/**
 * Cart mutations
 */

export type OptionSelections = {
  option_id: number
  option_value: number | string
}

export type CartItemBody = CoreCart.CartItemBody & {
  productId: string // The product id is always required for BC
  optionSelections?: OptionSelections
}

// export type GetCartHandlerBody = CoreCart.GetCartHandlerBody

// export type AddCartItemBody = Core.AddCartItemBody<CartItemBody>

// export type AddCartItemHandlerBody = Core.AddCartItemHandlerBody<CartItemBody>

// export type UpdateCartItemBody = Core.UpdateCartItemBody<CartItemBody>

// export type UpdateCartItemHandlerBody = Core.UpdateCartItemHandlerBody<CartItemBody>

// export type RemoveCartItemBody = Core.RemoveCartItemBody

// export type RemoveCartItemHandlerBody = Core.RemoveCartItemHandlerBody
