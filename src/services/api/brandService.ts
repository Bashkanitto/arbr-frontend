/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from './base'

export const fetchBrands = async () => {
  try {
    const response = await baseApi.get('/brand?pagination[pageSize]=1000&relations=image')
    return response
  } catch (error) {
    console.error('Error fetching brands:', error)
  }
}

export const fetchBrandsPage = async (page: number = 1, pageSize: number = 10) => {
  try {
    const response = await baseApi.get(
      `/brand?pagination[pageSize]=${pageSize}&pagination[page]=${page}&relations=image&sort[id]=desc`
    )
    return response
  } catch (error) {
    console.error('Error fetching brandPage:', error)
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
    console.error('Error uploading brandImage:', error)
  }
}

export const createBrand = async (name: string, file: any) => {
  try {
    const brandResponse: any = await baseApi.post('/brand', {
      name: name,
      rating: 5.0,
    })
    await uploadBrandImage(file, brandResponse.id)
    return brandResponse
  } catch (error) {
    console.error('Error creating brand:', error)
  }
}

export const deleteImage = async (filename: string) => {
  try {
    const response: any = await baseApi.delete(`/upload/${filename}`)
    return response
  } catch (error) {
    console.error('Error deleting image:', error)
  }
}

export const editBrand = async (brand: any, name: string, file: any, brandFilename: string) => {
  try {
    const brandResponse: any = await baseApi.patch(`/brand/${brand.id}?relations=image`, {
      name,
    })
    if (file) {
      if (brand.image.length !== 0) {
        await deleteImage(brandFilename)
        await uploadBrandImage(file, brand.id)
      } else {
        await uploadBrandImage(file, brand.id)
      }
    }

    return brandResponse
  } catch (error) {
    console.error('Error editing brand:', error)
  }
}

export const deleteBrand = async (brandId: string) => {
  try {
    const response = await baseApi.delete(`/brand/${brandId}`)
    return response
  } catch (error) {
    console.error('Error deleting brand:', error)
  }
}

export const fetchFeatures = async (page: number = 1, pageSize: number = 10) => {
  try {
    const response = await baseApi.get(
      `/main-feature?relations=brand.image,brand.features&pagnation[pageSize]=${pageSize}&pagination[page]=${page}&sort[id]=desc`
    )
    return response
  } catch (error) {
    console.error('Error fetching product:', error)
  }
}

export const createFeature = async (brandId: number, page: number = 1, pageSize: number = 10) => {
  try {
    const response = await baseApi.post(
      `/main-feature?relations=brand&pagnation[pageSize]=${pageSize}&pagination[page]=${page}&sort[id]=desc`,
      {
        brandId: brandId,
      }
    )

    if (response.data.error) {
      console.log(response.data.error)
      throw new Error(`Ошибка при создании баннера: ${response}`)
    }

    return response
  } catch (error) {
    console.error('Error creating feature:', error)
    throw error
  }
}

export const deleteFeature = async (featureId: string) => {
  try {
    const response = await baseApi.delete(`/main-feature/${featureId}`)
    return response
  } catch (error) {
    console.error('Error deleting feature:', error)
  }
}

export const fetchAllSubCategory = async () => {
  try {
    const response = await baseApi.get('/subcategory?pagination[pageSize]=1000')
    return response
  } catch (error) {
    console.error('Error fetching subcategory:', error)
  }
}

export const findSubCategory = async (categoryName: string) => {
  try {
    const response = await baseApi.get('/subcategory&search[subcategory][name]=' + categoryName)
    console.log(categoryName)
    return response
  } catch (error) {
    console.error('Error searching subcategory:', error)
  }
}
