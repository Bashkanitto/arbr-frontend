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

export interface VendorType {
	id: number | null | undefined
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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	vendorGroups: any[]
}

export interface VendorResponse {
	records: VendorType[]
	meta: {
		totalPages: number
		page: number
		total: number
	}
}
