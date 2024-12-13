/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from './base'
import { addProductType, VendorResponse, VendorType } from './Types'

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

// –––––––––––––––––- Получение один вендор –––––––––––––

export const fetchVendorById = async (id: any): Promise<any> => {
	try {
		const response: any = await baseApi.get(`/account/vendors/${id}`)
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
	files: any[],
	productId: number
): Promise<void> => {
	try {
		const formData = new FormData()
		formData.append('product', JSON.stringify(productId))
		files.forEach(file => formData.append('files', file))

		await baseApi.post('/upload/multiple', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
			timeout: 10000,
		})
	} catch (error) {
		console.error('Ошибка при отправке файлов:', error)
		throw new Error(
			`Не удалось загрузить файлы: ${
				error instanceof Error ? error.message : 'Неизвестная ошибка'
			}`
		)
	}
}

// –––––––––––––––––- Привязка продукта поставщику –––––––––––––
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

// –––––––––––––––––- Привязка продукта поставщику –––––––––––––
export const patchStatus = async (
	productId: number,
	status: string
): Promise<VendorType> => {
	try {
		const response: any = await baseApi.patch(`/product/${productId}`, {
			status,
		})
		return response
	} catch (error) {
		console.error('Error patching product status:', error)
		throw new Error(
			`Failed patching product status: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		)
	}
}

// –––––––––––––––––- Получение список продуктов  –––––––––––––
export const fetchVendorGroupById = async (productId: any) => {
	try {
		const response = await baseApi.get(
			`/vendor-group/${productId}?relations=product,product.images`
		)
		return response
	} catch (error) {
		console.error('Error fetching product:', error)
		throw new Error('Failed to fetch product details.')
	}
}
// –––––––––––––––––- Получение список продуктов  –––––––––––––
export const fetchVendorGroups = async (
	page: number = 1,
	pageSize: number = 10
): Promise<VendorResponse> => {
	try {
		const response: VendorResponse = await baseApi.get(
			`/vendor-group?relations=vendor,product&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
		)
		return response
	} catch (error) {
		console.error('Error fetching vendor-groups:', error)
		throw new Error(
			`Failed to fetch vendor-groups: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		)
	}
}

// –––––––––––––––––- Получение список продуктов  –––––––––––––
export const sendCatalogList = async (file: File): Promise<any> => {
	try {
		const formData = new FormData()
		formData.append('file', file)

		const response: any = await baseApi.post(
			'/product/import/google-sheet',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		)
		return response
	} catch (error) {
		console.error('Error fetching vendor-groups:', error)
		throw new Error(
			`Failed to fetch vendor-groups: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		)
	}
}
