import axios from 'axios'
import { env } from '@shared/utils/env.config'
import authStore from '@app/AuthStore'
import { logout } from './authService'

export const baseApi = axios.create({
  baseURL: env.baseUrl,
})

baseApi.interceptors.request.use(
  config => {
    if (authStore.accessToken) {
      config.headers['Authorization'] = `Bearer ${authStore.accessToken}`
    }
    return config
  },
  error => Promise.reject(error)
)

baseApi.interceptors.response.use(
  response => response,
  async (error: any) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true

      logout()
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth'
      }

      throw error
    }
  }
)

export default baseApi
