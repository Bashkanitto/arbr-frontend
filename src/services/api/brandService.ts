import baseApi from './base'

export const fetchBrands = async (): Promise<any> => {
	try {
		const response = await baseApi.get('/brand')
		return response
	} catch (error) {
		console.error('Error adding product:', error)
		throw new Error(
			`Failed to add product: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		)
	}
}


export const fetchSubCategory = async () => {
	try {
		const response = await baseApi.get('/subcategory')
		return response
	} catch (error) {
		console.error('Error adding product:', error)
		throw new Error(
			`Failed to add product: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		)
	}
}