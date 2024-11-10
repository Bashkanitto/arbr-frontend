// import { AxiosResponse } from 'axios'
// import { ProductType } from '../../../store/Types'
// import { baseApi } from '../base'

// // Функция для получения всех продуктов
// export const fetchProducts = async (): Promise<ProductType[]> => {
// 	try {
// 		const response: AxiosResponse<ProductType[]> = await baseApi.get('/product')
// 		return response.data
// 	} catch (error) {
// 		console.error('Ошибка получения продуктов:', error)
// 		throw new Error(`Ошибка получения продуктов: ${error}`)
// 	}
// }

// // Функция для получения продукта по ID
// export const fetchProductById = async (id: string): Promise<ProductType> => {
// 	try {
// 		const response: AxiosResponse<ProductType> = await baseApi.get(
// 			`/product/${id}`
// 		)
// 		return response.data
// 	} catch (error) {
// 		console.error('Ошибка получения продукта по ID:', error)
// 		throw new Error(`Ошибка получения продукта по ID: ${error}`)
// 	}
// }
