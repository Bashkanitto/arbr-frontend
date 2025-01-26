/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UserType {
	id(id: any): unknown
	email: string
	phone: string
	role: string
	loginAt: Date
	firstName: string
	lastName: string
	userName: string
	legalName: string
	dateOfBirth: Date
	fcm: string
	iin: string
	bin: string
	bik: string
	rating: number
	status: string
	bonusAmount: number
	deliveryAddresses: string[]
	transactions: string[]
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
	name: string
	brand?: BrandType
	createdAt: string
	deletedAt?: string
	features?: {
		isBonus: boolean
		isFreeDelivery: boolean
		isDiscount: boolean
		bonus: string
		discount: string
	}
	id: number | null
	images?: any[]
	price: number | null
	quantity: number
	rating: string
	code?: string
	ENSTRU?: string | null
	GTIN?: string | null
	KZTIN?: string | null
	options?: string | null
	options2?: string | null
	options3?: string | null
	package?: number | null
	status: string
	updatedAt: string
}

export interface VendorGroups {
	id: number
	price: number
	product: ProductType
}

export interface VendorType {
	createdAt: string
	id: number
	email: string
	phone: string
	role: string
	loginAt: string
	firstName: string
	lastName: string
	userName: string
	legalName: string
	dateOfBirth: string
	fcm: string
	iin: string
	bin: string
	bik: string
	rating: number
	status: string
	bonusAmount: number
	deliveryAddresses: string[]
	paymentCards: Array<{
		account: unknown
		cvv: number
		cardNumber: string
		expiredMonth: number
		expiredYear: number
		ownerName: string
	}>
	transactions: string[]
	vendorGroups: VendorGroups[]
}

export interface VendorResponse {
	records: VendorType[]
	meta: {
		totalPages: number
		page: number
		total: number
	}
}

export interface addProductType {
	name: string
	options: string
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
