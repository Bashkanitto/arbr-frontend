// services/api/accountsService.ts
import { baseApi } from './base'

// Define the account data structure
export interface AccountType {
	status: string
	id: number
	createdAt: string
	firstName: string
	role: string
}

interface MetaType {
	totalPages: number
	page: number
	total: number
}

export const fetchAccounts = async (): Promise<AccountType[]> => {
	try {
		const response: { meta: MetaType; records: AccountType[] } =
			await baseApi.get('/account')
		return response.records
	} catch (error) {
		console.error('Error fetching last confirmed accounts:', error)
		throw new Error('Failed to fetch last confirmed accounts')
	}
}
