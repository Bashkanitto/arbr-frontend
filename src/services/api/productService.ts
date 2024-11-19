import { baseApi } from './base'

export const fetchAllVendors = async (): any => {
	// export const fetchAllVendors = async (): Promise<VendorResponse[]> => {
	try {
		const response = await baseApi.get('/account/vendors')
		return response.data
	} catch (error: unknown) {
		console.error('Error fetching vendors:', error)
		throw new Error(
			`Failed to fetch vendors: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		)
	}
}
