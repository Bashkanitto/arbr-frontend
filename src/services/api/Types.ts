/* eslint-disable @typescript-eslint/no-explicit-any */
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
  wishlist: unknown[]
}

export interface BrandType {
  name: string
  products: any[]
  image: any[]
  rating: number
  features: {
    isBonus: boolean
    isFreeDelivery: boolean
    isDiscount: boolean
    bonus: number
    discount: number
  }
}

export interface ProductType {
  id: number
  name: string
  description: string | undefined
  brand?: BrandType
  subcategory?: {
    name: string
    updatedAt: string
    createdAt: string
    deletedAt: string | null
    category: {
      name: string
      mainCategory: unknown
      subcategories: unknown
    }
  }
  deletedAt?: string
  features?: {
    isBonus: boolean
    isFreeDelivery: boolean
    isDiscount: boolean
    bonus: string
    discount: string
  }
  images?: Array<{
    url: string
    filename: string
  }>
  price: number
  quantity: number
  rating: string
  keywords: string
  code?: string
  ENSTRU?: string | null
  GTIN?: string | null
  KZTIN?: string | null
  package?: number | null
  options?: unknown | null
  status: string
  createdAt: string
  updatedAt: string
  vendorGroups: VendorGroups[]
  youtubeVideoUrl: string | null
}

export interface VendorGroups {
  id: number
  price: number
  createdAt: number
  deletedAt: number | null
  product: ProductType
  productDocuments: Array<{ id: string; originalname: string; url: string; filename: string }>
}

export interface addProductType {
  name: string
  options?: string
  description: string
  quantity: number
  price: number
  amountPrice: number
  rating: number
  brandId: number
  subcategoryId: number
  features: {
    isBonus: boolean
    isFreeDelivery: boolean
    isDiscount: boolean
    bonus: number | null
    discount: number | null
  }
}
