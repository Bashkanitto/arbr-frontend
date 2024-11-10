// import { makeAutoObservable, runInAction } from 'mobx'
// import {
// 	fetchProductById,
// 	fetchProducts,
// } from '../services/api/product/productService'
// import { ProductType } from './Types'

// class ProductStore {
// 	products: ProductType[] = []
// 	selectedProduct: ProductType | null = null
// 	loading = false

// 	constructor() {
// 		makeAutoObservable(this)
// 	}

// 	// Получение списка продуктов
// 	async loadProducts() {
// 		this.loading = true
// 		try {
// 			const products = await fetchProducts()
// 			runInAction(() => {
// 				this.products = products
// 			})
// 		} catch (error) {
// 			console.error('Ошибка загрузки продуктов:', error)
// 		} finally {
// 			runInAction(() => {
// 				this.loading = false
// 			})
// 		}
// 	}

// 	// Получение данных по конкретному продукту
// 	async loadProductById(id: string) {
// 		this.loading = true
// 		try {
// 			const product = await fetchProductById(id)
// 			runInAction(() => {
// 				this.selectedProduct = product
// 			})
// 		} catch (error) {
// 			console.error('Ошибка загрузки продукта:', error)
// 		} finally {
// 			runInAction(() => {
// 				this.loading = false
// 			})
// 		}
// 	}
// }

// const productStore = new ProductStore()
// export default productStore
