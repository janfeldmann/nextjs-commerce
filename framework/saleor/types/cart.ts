import * as Core from '@commerce/types/cart'
import * as CheckoutCore from '@commerce/types/checkout'
import { Address, CollectionPoint, Order, Payment, PaymentInput, ShippingMethod } from '@framework/schema'

export * from '@commerce/types/cart'

export type SaleorCart = {}

/**
 * Extend core cart types
 */

export type Cart = Core.Cart & {
  lineItems: Core.LineItem[]
  url?: string
  billingAddress?: Address
  shippingAddress?: Address
  deliveryMethod?: ShippingMethod | CollectionPoint
  availableShippingMethods?: [ShippingMethod]
  availableCollectionPoints?: [CollectionPoint]
  payment?: Payment
  order?: Order
}

export type CartTypes = Core.CartTypes & {
  cart?: Cart
}

export type CartHooks = Core.CartHooks<CartTypes>

export type GetCartHook = CartHooks['getCart']
export type AddItemHook = CartHooks['addItem']
export type UpdateItemHook = CartHooks['updateItem']
export type RemoveItemHook = CartHooks['removeItem']
export type UpdateDeliveryHook = CartHooks['updateDelivery']
export type UpdateBillingAddressHook = CartHooks['updateBillingAddress']
export type CreatePaymentHook = CheckoutCore.CreatePaymentHook

export type CartSchema = Core.CartSchema<CartTypes>

export type CartHandlers = Core.CartHandlers<CartTypes>

export type GetCartHandler = CartHandlers['getCart']
export type AddItemHandler = CartHandlers['addItem']
export type UpdateItemHandler = CartHandlers['updateItem']
export type RemoveItemHandler = CartHandlers['removeItem']
