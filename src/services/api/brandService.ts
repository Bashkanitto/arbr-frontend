/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from './base'

export const fetchBrands = async () => {
	try {
		const response = await baseApi.get('/brand?pagination[pageSize]=1000&relations=image')
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

export const fetchBrandsPage = async (page:number = 1, pageSize:number = 10) => {
	try {
		const response = await baseApi.get(`/brand?pagination[pageSize]=${pageSize}&pagination[page]=${page}&relations=image&sort[id]=desc`)
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

export const uploadBrandImage = async (file: any, brandId: number) => {
	try {
		const formData = new FormData()
		formData.append('brand', JSON.stringify(brandId))
		formData.append('files', file)

		await baseApi.post('/upload/multiple', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
			timeout: 60000,
		})
	} catch (error) {
		console.error('Ошибка при отправке файлов:', error)
	}
}

export const createBrand = async (name: string, file:any) => {

	try {
		const brandResponse: any = await baseApi.post('/brand', {name: name, rating: 5.00})
		await uploadBrandImage(file, brandResponse.id)
		return brandResponse
	} catch (error) {
		console.error('Error adding product:', error)
		throw new Error(
			`Failed to add product: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		)
	}
}

export const deleteBrand = async (brandId: string) => {
	try {
		const response = await baseApi.delete(`/brand/${brandId}`)
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

export const fetchFeatures = async () => {
	try {
		const response = await baseApi.get('/main-feature?relations=brand.image,brand.features')
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

export const createFeature = async (brandId: number) => {
	try {
		console.log(brandId)
		const response = await baseApi.post('/main-feature?relations=brand', {brandId: brandId})
		return response
	} catch (error) {
		console.error('Error adding product:', error)
		throw new Error(
			`Failed to add feature: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		)
	}
}

export const deleteFeature = async (featureId: string) => {
	try {
		const response = await baseApi.delete(`/main-feauture/${featureId}`)
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