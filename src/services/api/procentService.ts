// src/services/api/procentService.ts
import baseApi from './base'

export const updateBonus = async (productId: number, bonus: number) => {
	const updatedData = {
		features: {
			isBonus: true,
			isFreeDelivery: true,
			isDiscount: true,
			bonus,
			discount: 0,
		},
	}

	try {
		const response = await baseApi.patch(
			`/vendor-group/${productId}`,
			updatedData
		)
		return response.data
	} catch (error) {
		throw new Error('Error updating bonus')
	}
}
