import baseApi from './base'
import { VendorResponse } from './Types'

// Fetch vendors
export const fetchAllVendors = async (): Promise<VendorResponse> => {
	try {
		const response: VendorResponse = await baseApi.get('/account/vendors')
		return response
	} catch (error) {
		console.error('Error fetching vendors:', error)
		throw new Error(
			`Failed to fetch vendors: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		)
	}
}
