import { BrandType, VendorGroups } from "@shared/types/Types"

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
  
