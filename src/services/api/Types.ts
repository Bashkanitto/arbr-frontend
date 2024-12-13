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

export interface Product {
	amountPrice: string
	brand: any[]
	createdAt: string
	deletedAt: string
	description: string
	id: number
	images: any[]
	name: string
	price: number
	quantity: number
	rating: string
	status: string
	updatedAt: string
}

export interface VendorGroups {
	id: number
	price: number
	product: Product
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
		bonus: number
		discount: number
	}
}
