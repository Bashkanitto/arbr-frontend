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
		const response = await baseApi.get(`/brand?pagination[pageSize]=${pageSize}&pagination[page]=${page}&relations=image`)
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

export const createBrand = async (name: string, file:any) => {
	const formData = new FormData();
	formData.append("name", name);
	formData.append('image', file)

	console.log(formData)

	try {
		const response = await baseApi.post('/brand', formData, { headers: {'Content-Type': 'multipart/form-data'}, timeout: 60000 })
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