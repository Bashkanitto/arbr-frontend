export interface UserType {
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

// Определим тип для продуктов
export interface ProductType {
	name: string
	description: string
	quantity: number
	price: number
	amountPrice: number
	rating: number
	brand: {
		name: string
		rating: number
		image: {
			filename: string
			originalname: string
			mimetype: string
			size: number
			bucket: string
			url: string
		}
		features: Record<string, unknown>
	}
	subcategory: {
		name: string
		category: {
			name: string
			mainCategory: unknown
			subcategories: (null | ProductType)[]
		}
	}
	images: string[]
	userWishList: string[]
	features: Record<string, unknown>
}

export interface VendorResponse {
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
		account: VendorResponse
		cvv: number
		cardNumber: string
		expiredMonth: number
		expiredYear: number
		ownerName: string
	}>
	transactions: string[]
}
