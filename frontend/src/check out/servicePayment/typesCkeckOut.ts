export interface checkOut_resp {
  total_price: number
  receive_type: string
  payment_type: string
  address_id: number
  promo_code_id: number
}
export interface payment {
  products: Product[]
}

export interface Product {
  productId: number
  quantity: number
}
