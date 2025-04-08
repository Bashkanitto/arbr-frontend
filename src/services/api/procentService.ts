import baseApi from './base'

export const updateBonus = async (vendorId: number | null, bonus: number | string) => {
  try {
    const updatedData = {
      features: {
        isBonus: bonus !== 0 ? true : false,
        bonus,
      },
    }

    const response = await baseApi.patch(`/vendor-group/${vendorId}`, updatedData)
    return response.data
  } catch (error) {
    console.error('Error updating bonus:', error)
    throw new Error('Error updating bonus')
  }
}

// ––––––––––––––––––––––––––––Discount–––––––––––––––––––––––––––––––
export const updateDiscount = async (vendorId: number, discount: number | string) => {
  try {
    const updatedData = {
      features: {
        isDiscount: true,
        discount,
      },
    }

    const response = await baseApi.patch(`/vendor-group/${vendorId}`, updatedData)
    return response.data
  } catch (error) {
    console.error('Error updating discount:', error)
    throw new Error('Error updating discount')
  }
}
