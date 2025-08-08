
// src/services/api/AccountsService.ts
import { baseApi } from './base'

export interface ManagerType {
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

export const fetchAllManagers = async (
  page: number = 1,
  pageSize: number = 10
): Promise<{ records: ManagerType[]; meta: MetaType }> => {
  try {
    const response: any = await baseApi.get(
      `/account/?pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    )
    return response
  } catch (error) {
    console.error('Error fetching last confirmed accounts:', error)
    throw new Error('Failed to fetch last confirmed accounts')
  }
}

export const deleteManager = async (
  id: number
): Promise<{ records: ManagerType[]; meta: MetaType }> => {
  try {
    const response: any = await baseApi.delete(`/account/${id}`)
    return response
  } catch (error) {
    console.error('Error fetching last confirmed accounts:', error)
    throw new Error('Failed to fetch last confirmed accounts')
  }
}
