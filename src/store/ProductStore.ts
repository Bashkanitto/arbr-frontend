// stores/ProductStore.js
import { makeAutoObservable, runInAction } from 'mobx'

class ProductStore {
	products = []
	loading = false
	error = null

	constructor() {
		makeAutoObservable(this)
	}

	async fetchProducts() {
		this.loading = true
		this.error = null
		try {
			const response = await fetch('/product')
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`)
			}
			const data = await response.json()
			runInAction(() => {
				this.products = data
				this.loading = false
			})
		} catch (error) {
			runInAction(() => {
				this.error = 'Failed to load products'
				this.loading = false
			})
		}
	}

	get productCount() {
		return this.products.length
	}
}

const productStore = new ProductStore()
export default productStore
