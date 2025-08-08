// src/services/api/AccountsService.ts
import { baseApi } from './base'

export interface VendorType {
  status: string
  id: number
  createdAt: string
  firstName: string
  loginAt: Date
  role: string
}

interface MetaType {
  totalPages: number
  page: number
  total: number
}

export const fetchAllVendors = async (
  page: number = 1,
  pageSize: number = 10
): Promise<{ records: VendorType[]; meta: MetaType }> => {
  try {
    const response: any = await baseApi.get(
      `/account/vendors?pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    )
    return response
  } catch (error) {
    throw error
  }
}

export const patchVendor = async (id: number, status: string) => {
  try {
    const response: any = await baseApi.patch(`/account/vendor${id}`, {
      status,
    })
    return response
  } catch (error) {
    throw error
  }
}
