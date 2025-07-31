import axios from 'axios'
import { env } from '@shared/utils/env.config'
import authStore from '@app/AuthStore'
import { logout } from './authService'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  
  failedQueue = []
}

export const baseApi = axios.create({
  baseURL: env.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
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
      if (isRefreshing) {
        // Если токен уже обновляется, добавляем запрос в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`
          return baseApi(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      // Проверяем есть ли refresh token
      if (!authStore.refreshToken) {
        processQueue(error, null)
        isRefreshing = false
        
        logout()
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth'
        }
        return Promise.reject(error)
      }

      try {
        // Пытаемся обновить токен через AuthStore
        const success = await authStore.refreshAccessToken()
        
        if (success && authStore.accessToken) {
          // Обновляем заголовок для оригинального запроса
          originalRequest.headers['Authorization'] = `Bearer ${authStore.accessToken}`
          
          processQueue(null, authStore.accessToken)
          isRefreshing = false

          // Повторяем оригинальный запрос
          return baseApi(originalRequest)
        } else {
          throw new Error('Token refresh failed')
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        processQueue(refreshError, null)
        isRefreshing = false
        
        // Выполняем logout при неудачном обновлении
        authStore.logout()
        
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth'
        }
        
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default baseApi