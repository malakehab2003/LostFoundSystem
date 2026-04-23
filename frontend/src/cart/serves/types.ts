export interface sendValues {
  color: string
  size: string
  product_id: number
  quantity: number
}
export interface cartitem {
  id: number
  quantity: number
  color: string
  size: string
  created_at: string
  updated_at: string
  user_id: number
  product_id: number
}
 export interface updataValue {
  product_id: number
  cart_id: number
  operation: string
}