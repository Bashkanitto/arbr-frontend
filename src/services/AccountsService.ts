// src/services/api/AccountsService.ts
import { UserType } from '@shared/types/UserType'
import { baseApi } from './base'

export interface AccountType {
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

export const fetchAllAccounts = async (): Promise<{ records: UserType[]; meta: MetaType }> => {
  try {
    const response: any = await baseApi.get(
      `/account?pagination[pageSize]=600&sort[id]=desc`
    )
    return response
  } catch (error) {
    throw error
  }
}

export const patchAccount = async (id: number, status: string) => {
  try {
    const response: any = await baseApi.patch(`/account/${id}`, {
      status,
    })
    return response
  } catch (error) {
    throw error
  }
}

export const deleteAccount = async (
  id: number
): Promise<{ records: AccountType[]; meta: MetaType }> => {
  try {
    const response: any = await baseApi.delete(`/account/${id}`)
    return response
  } catch (error) {
    throw error
  }
}
