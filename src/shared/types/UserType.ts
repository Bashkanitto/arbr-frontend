import { VendorGroups } from "./Types"

export interface UserType {
  id: number
  email: string
  password: string
  phone: string | null
  role: string
  loginAt: Date
  firstName: string
  lastName: string | null
  userName: string | null
  legalName: string
  dateOfBirth: Date | null
  fcm: string
  iin: string
  bin: string
  bik: string
  rating: number | null
  createdAt: string
  updatedAt: string
  deletedAt: string
  orders: unknown[]
  paymentCards: Array<{
    account: unknown
    cvv: number
    cardNumber: string
    expiredMonth: number
    expiredYear: number
    ownerName: string
  }>
  status: string
  bonusAmount: number
  deliveryAddresses: string[]
  transactions: unknown[]
  vendorGroups: Array<VendorGroups>
  wishlist: unknown[]
}