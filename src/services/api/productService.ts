/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from './base'
import { addProductType, VendorResponse } from './Types'

// –––––––––––––––––- Получение всех тендеров –––––––––––––
export const fetchAllVendors = async (
	page: number = 1,
	pageSize: number = 10
): Promise<VendorResponse> => {
	try {
		const response: VendorResponse = await baseApi.get(
			`/account/vendors?pagination[page]=${page}&pagination[pageSize]=${pageSize}`
		)
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
		return response
	} catch (error) {
		console.error('Error fetching product:', error)
		throw new Error('Failed to fetch product details.')
	}
}

// –––––––––––––––––- Добавление продукта –––––––––––––
export const addProduct = async (productData: addProductType): Promise<any> => {
	try {
		const response = await baseApi.post('/product', productData)
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

// –––––––––––––––––- Привязка продукта поставщику –––––––––––––

export const addVendorGroup = async ({
	productId,
	vendorId,
	price,
}: {
	productId: number
	vendorId: number
	price: string
}): Promise<any> => {
	try {
		const response = await baseApi.post('/vendor-group/add', {
			productId,
			vendorId,
			price,
		})
		return response
	} catch (error) {
		console.error('Error adding to vendor group:', error)
		throw new Error(
			`Failed to add to vendor group: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		)
	}
}

// –––––––––––––––––- Загрузка изображения –––––––––––––
export const uploadMultipleImages = async (
	files: string[], // теперь массив строк Base64
	productId: number
): Promise<any> => {
	try {
		const body = {
			product: productId,
			files, // Отправляем массив строк
		}

		const response = await baseApi.post('/upload/multiple', body)
		return response
	} catch (error) {
		console.error('Ошибка при отправке файлов:', error)
		throw new Error(
			`Не удалось загрузить файлы: ${
				error instanceof Error ? error.message : 'Неизвестная ошибка'
			}`
		)
	}
}

export const fetchAllProducts = async (): Promise<VendorResponse> => {
	try {
		const response: any = await baseApi.get('/product')
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
