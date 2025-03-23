/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from './base'
import { addProductType } from './Types'

// –––––––––––––––––- Получение всех тендеров –––––––––––––
export const fetchAllVendors = async (page: number = 1, pageSize: number = 10) => {
  try {
    const response: any = await baseApi.get(
      `/account/vendors?pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    )
    return response
  } catch (error) {
    console.error('Error fetching vendors:', error)
  }
}

// –––––––––––––––––- Получение один вендор –––––––––––––

export const fetchVendorById = async (id: any) => {
  try {
    const response: any = await baseApi.get(`/account/vendors/${id}`)
    return response
  } catch (error) {
    console.error('Error fetching vendors:', error)
  }
}

// –––––––––––––––––- Получение конкретного продукта –––––––––––––
export const fetchProductById = async (productId: any) => {
  try {
    const response = await baseApi.get(
      `/product/${productId}?relations=images,features,vendorGroups,vendorGroups.productDocuments`
    )
    return response
  } catch (error) {
    console.error('Error fetching product:', error)
  }
}

// –––––––––––––––––- Добавление продукта –––––––––––––
export const addProduct = async (productData: addProductType) => {
  try {
    const response = await baseApi.post('/product', productData)
    return response
  } catch (error) {
    console.error('Error adding product:', error)
  }
}

// –––––––––––––––––- Привязка продукта поставщику –––––––––––––
export const addVendorGroup = async ({
  productId,
  vendorId,
  price,
}: {
  productId: number
  vendorId: number
  price: string
}) => {
  try {
    const response = await baseApi.post('/vendor-group/add', {
      productId,
      vendorId,
      price,
    })
    return response
  } catch (error) {
    console.error('Error adding to vendor group:', error)
  }
}

// –––––––––––––––––- Загрузка изображения –––––––––––––
export const uploadMultipleImages = async (files: any[], productId: number) => {
  try {
    const formData = new FormData()
    formData.append('product', JSON.stringify(productId))
    files.forEach(file => formData.append('files', file))

    await baseApi.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    })
  } catch (error) {
    console.error('Ошибка при отправке файлов:', error)
  }
}

// –––––––––––––––––- Загрузка изображения –––––––––––––
export const uploadProductDocument = async (files: File[], vendorGroupId: null | number) => {
  try {
    const formData = new FormData()
    formData.append('vendorGroup', JSON.stringify(vendorGroupId))

    files.forEach(file => {
      formData.append('files', file)
    })

    await baseApi.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data;>',
      },
      timeout: 10000,
    })
  } catch (error) {
    console.error('Ошибка при отправке файлов:', error)
  }
}

// –––––––––––––––––- Привязка продукта поставщику –––––––––––––
export const fetchMyProducts = async (vendorId: number | string) => {
  try {
    const response: any = await baseApi.get(`/vendor-group`, {
      params: {
        'search[vendor][id]': vendorId,
        relations: 'product,features',
        'sort[product][id]': 'desc',
      },
    })
    return response
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

// –––––––––––––––––- Привязка продукта поставщику –––––––––––––
export const patchStatus = async (productId: number, status: string) => {
  try {
    const response: any = await baseApi.patch(`/product/${productId}`, {
      status,
    })
    return response
  } catch (error) {
    console.error('Error patching product status:', error)
  }
}

// –––––––––––––––––- Получение список продуктов  –––––––––––––
export const fetchVendorGroupById = async (productId: any) => {
  try {
    const response = await baseApi.get(
      `/vendor-group/${productId}?relations=product,features,product.images,productDocuments`
    )
    return response
  } catch (error) {
    console.error('Error fetching product:', error)
  }
}

// –––––––––––––––––- Получение список продуктов  –––––––––––––
export const fetchUserById = async (userId: any) => {
  try {
    const response = await baseApi.get(
      `/vendor-group/?relations=product,features&search[vendor][id]=${userId}`
    )
    return response
  } catch (error) {
    console.error('Error fetching /vendor-group/:', error)
  }
}
// –––––––––––––––––- Получение список продуктов  –––––––––––––
export const fetchVendorGroups = async (page: number = 1, pageSize: number = 10) => {
  try {
    const response = await baseApi.get(
      `/vendor-group?relations=vendor,product,productDocuments&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[id]=desc`
    )
    return response
  } catch (error) {
    console.error('Error fetching vendor-groups:', error)
  }
}

// –––––––––––––––––- Получение список продуктов  –––––––––––––
export const sendCatalogList = async (file: File): Promise<any> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response: any = await baseApi.post('/product/import/google-sheet', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response
  } catch (error) {
    console.error('Error fetching vendor-groups:', error)
  }
}
// –––––––––––––––––- Получение список продуктов  –––––––––––––
export const fetchMyOrders = async (page: number = 1, pageSize: number = 10) => {
  try {
    const response: any = await baseApi.get(
      `/order/admin?relations=user,cartItems.product&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    )
    return response
  } catch (error) {
    console.error('Error fetching order:', error)
  }
}

export const deleteDocument = async (filename: string) => {
  try {
    const response = await baseApi.delete(`/upload/${filename}`)
    return response
  } catch (error) {
    console.log(error)
  }
}

export const deleteProduct = async (productId: number) => {
  try {
    const response: any = await baseApi.delete(`/product/${productId}`)
    return response
  } catch (error) {
    console.log(error)
  }
}

export const editProduct = async (
  productId: number,
  data: { description: string | null | undefined }
) => {
  try {
    const response: any = await baseApi.patch(`/product/${productId}`, data)
    return response
  } catch (error) {
    console.log(error)
  }
}
