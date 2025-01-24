import baseApi from './base'

export const updateBonus = async (productId: number | null, bonus: number) => {
	try {
		const updatedData = {
			features: {
				isBonus: bonus !== 0 ? true : false,
				bonus,
			},
		}

		const response = await baseApi.patch(`/product/${productId}`, updatedData)
		return response.data
	} catch (error) {
		console.error('Error updating bonus:', error)
		throw new Error('Error updating bonus')
	}
}

// ––––––––––––––––––––––––––––Discount–––––––––––––––––––––––––––––––
export const updateDiscount = async (productId: number, discount: number) => {
	try {
		const updatedData = {
			features: {
				isDiscount: true,
				discount,
			},
		}

		const response = await baseApi.patch(
			`/vendor-group/${productId}`,
			updatedData
		)
		return response.data
	} catch (error) {
		console.error('Error updating discount:', error)
		throw new Error('Error updating discount')
	}
}
