import baseApi from './base'

export const fetchBrands = async () => {
	try {
		const response = await baseApi.get('/brand?pagination[pageSize]=1000')
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


export const fetchAllSubCategory = async () => {
	try {
		const response = await baseApi.get('/subcategory?pagination[pageSize]=1000')
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

export const findSubCategory = async (categoryName:string) => {
	try {
		const response = await baseApi.get('/subcategory&search[subcategory][name]=' + categoryName)
		console.log(categoryName)
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