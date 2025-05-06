export interface BrandType {
    id: string
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