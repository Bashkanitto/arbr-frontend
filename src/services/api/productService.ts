/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from './base'
import { addProductType, VendorResponse } from './Types'

// –––––––––––––––––- Получение всех тендеров –––––––––––––
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

// –––––––––––––––––- Получение конкретного продукта –––––––––––––
export const fetchProductById = async (productId: any) => {
	try {
		const response = await baseApi.get(`/product/${productId}?relations=images`)
		return response // Assuming the response contains the product data in `data`
	} catch (error) {
		console.error('Error fetching product:', error)
		throw new Error('Failed to fetch product details.')
	}
}

// –––––––––––––––––- Добавление продукта –––––––––––––
export const addProduct = async (productData: addProductType): Promise<any> => {
	try {
		const response = await baseApi.post('/product', productData)
		return response // Assuming the API returns the created product or a success message
	} catch (error) {
		console.error('Error adding product:', error)
		throw new Error(
			`Failed to add product: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		)
	}
}
