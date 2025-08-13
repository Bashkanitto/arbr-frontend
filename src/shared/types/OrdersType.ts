export interface OrderType {
  id: number
  announcementNumber?: string
  announcementNumberEcc?: string
  user?: { firstName?: string }
  cartItems: { product?: { id: number; name: string } }[]
  type: string
  deliveryAdress?: string
  amountPrice: number
  trackerUrl:string
  status: string
}