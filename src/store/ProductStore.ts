import { makeAutoObservable, runInAction } from 'mobx'
// import { VendorResponse } from '../services/api/Types'
import { fetchAllVendors } from '../services/api/productService'

class ProductStore {
	vendorData: unknown = null
	loading = false
	error: string | null = null

	constructor() {
		makeAutoObservable(this)
	}

	async loadVendorDetails() {
		try {
			const data = await fetchAllVendors()
			runInAction(() => {
				this.vendorData = data
				this.error = null
			})
		} catch (err: unknown) {
			runInAction(() => {
				this.error =
					err instanceof Error
						? `Failed to load vendor data: ${err.message}`
						: 'An unknown error occurred'
			})
		}
	}

	get hasVendorData() {
		return !!this.vendorData
	}
}

const productStore = new ProductStore()
export default productStore
