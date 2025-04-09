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
  vendorGroups: Array<VendorGroups>
  wishlist: unknown[]
}

export interface BrandType {
  filter(
    arg0: (brand: any) => any
  ): import('react').SetStateAction<{ value: string; label: string }[]>
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
  images: any
  price: number
  quantity: number
  location: string
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
  vendor: any
  features?: {
    isBonus: boolean
    isFreeDelivery: boolean
    isDiscount: boolean
    bonus: string
    discount: number
  }
  deletedAt: number | null
  product: ProductType
  productDocuments: Array<{ id: string; originalname: string; url: string; filename: string }>
}
