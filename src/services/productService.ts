/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from './base'

// –––––––––––––––––- Получение всех тендеров –––––––––––––
export const fetchAllVendors = async (page: number = 1, pageSize: number = 10) => {
  const response: any = await baseApi.get(
    `/account/vendors?pagination[page]=${page}&pagination[pageSize]=${pageSize}`
  )
  return response
}

// –––––––––––––––––- Получение один вендор –––––––––––––

export const fetchVendorById = async (id: any) => {
  const response: any = await baseApi.get(`/account/vendors/${id}`)
  return response
}

// –––––––––––––––––- Получение конкретного продукта –––––––––––––
export const fetchProductById = async (productId: any) => {
  const response = await baseApi.get(
    `/product/${productId}?relations=images,features,subcategory,brand,vendorGroups,vendorGroups.vendor,vendorGroups.features,vendorGroups.productDocuments`
  )
  return response
}

// –––––––––––––––––- Получение группы –––––––––––––
export const fetchGroup = async () => {
  const response = await baseApi.get('/group?relations=groupItems,groupItems.product')
  return response
}

// –––––––––––––––––- Добавление продукта –––––––––––––
export const addProduct = async (productData: any) => {
  const response = await baseApi.post('/product', productData)
  return response
}

// –––––––––––––––––- Привязка продукта поставщику –––––––––––––
export const addVendorGroup = async ({
  productId,
  vendorId,
  price,
  features,
}: {
  productId: number
  vendorId: number
  price: string
  features: {
    isBonus: boolean
    isDiscount: boolean
    isFreeDelivery?: boolean
    discount: string | number | undefined
    bonus: string | number | undefined
  }
}) => {
  const response = await baseApi.post('/vendor-group/add', {
    productId,
    vendorId,
    price,
    features,
  })
  return response
}

// –––––––––––––––––- Загрузка изображения –––––––––––––
export const uploadMultipleImages = async (files: any[], productId: number) => {
  const formData = new FormData()
  formData.append('product', JSON.stringify(productId))
  files.forEach(file => formData.append('files', file))

  const response = await baseApi.post('/upload/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  })
  if (!response) {
    return false
  }
  return response
}

// –––––––––––––––––- Загрузка изображения –––––––––––––
export const uploadProductDocument = async (files: File[], vendorGroupId: null | number) => {
  const formData = new FormData()
  formData.append('vendorGroup', JSON.stringify(vendorGroupId))

  files.forEach(file => {
    formData.append('files', file)
  })

  const response = await baseApi.post('/upload/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data;>',
    },
    timeout: 10000,
  })
  if (!response) {
    throw new Error()
  }
}

// –––––––––––––––––- Привязка продукта поставщику –––––––––––––
export const fetchMyProducts = async (vendorId: number | string) => {
  const response: any = await baseApi.get(`/vendor-group`, {
    params: {
      'search[vendor][id]': vendorId,
      relations: 'product,features',
      'sort[product][id]': 'desc',
    },
  })
  return response
}

// –––––––––––––––––- Привязка продукта поставщику –––––––––––––
export const patchStatus = async (productId: number, status: string) => {
  const response: any = await baseApi.patch(`/product/${productId}`, {
    status,
  })
  return response
}

// –––––––––––––––––- Получение список продуктов  –––––––––––––
export const fetchVendorGroupById = async (productId: any) => {
  const response = await baseApi.get(
    `/vendor-group/${productId}?relations=product,features,product.images,productDocuments`
  )
  return response
}

// –––––––––––––––––- Получение список продуктов  –––––––––––––
export const fetchUserById = async (userId: any) => {
  const response = await baseApi.get(
    `/vendor-group/?relations=product,features&search[vendor][id]=${userId}`
  )
  return response
}
// –––––––––––––––––- Получение список продуктов  –––––––––––––
export const fetchVendorGroups = async (page: number = 1, pageSize: number = 10) => {
  const response = await baseApi.get(
    `/vendor-group?relations=vendor,product,productDocuments&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[id]=desc`
  )
  return response
}

// –––––––––––––––––- Изменение цены продукта  –––––––––––––
export const changeVendorGroupPrice = async (id: number, price: number | string) => {
  const response = await baseApi.patch(
    `/vendor-group/${id}?relations=vendor,product,productDocuments`,
    { price }
  )
  return response
}

// –––––––––––––––––- Получение список продуктов  –––––––––––––
export const sendCatalogList = async (file: File): Promise<any> => {
  const formData = new FormData()
  formData.append('file', file)

  const response: any = await baseApi.post('/product/import/google-sheet', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}
// –––––––––––––––––- Получение список продуктов  –––––––––––––
export const fetchOrders = async (page: number = 1, pageSize: number = 10) => {
  const response: any = await baseApi.get(
    `/order/admin?relations=user,cartItems.product&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[id]=asc`
  )
  return response
}

export const fetchAllOrders = async () => {
  const response: any = await baseApi.get(
    '/order/admin?relations=user,cartItems.product&sort[id]=desc&pagination[pageSize]=500'
  )
  return response
}

export const fetchMyOrders = async (page: number = 1, pageSize: number = 10, email: string) => {
  const response: any = await baseApi.get(
    `/order?relations=user,cartItems.product&pagination[page]=${page}&pagination[pageSize]=${pageSize}&search[cartItems][vendorGroup][vendor][email]=${email}&sort[id]=desc`
  )
  return response
}

export const deleteProduct = async (productId: number) => {
  const response: any = await baseApi.delete(`/product/${productId}`)
  return response
}

export const editProduct = async (productId: number | undefined, data: any) => {
  const response: any = await baseApi.patch(`/product/${productId}`, data)
  return response
}

export const editGroup = async (groupId: string, data: any) => {
  const response: any = await baseApi.patch(`/group/${groupId}`, data)
  return response
}

export const deleteGroup = async (groupId: string) => {
  const response: any = await baseApi.delete(`/group/${groupId}`)
  return response
}

export const addGroup = async formData => {
  const response: any = await baseApi.post(`/group`, formData)
  return response
}
