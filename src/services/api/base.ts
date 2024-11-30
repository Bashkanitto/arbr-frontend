import axios from 'axios'
import { env } from '../../configs/env.config'
import authStore from '../../store/AuthStore'
import { logout, refreshAccessToken } from './authService'

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
	response => response.data,
	async (error: any) => {
		const originalRequest = error.config

		if (
			error.response?.status === 401 &&
			originalRequest &&
			!originalRequest._retry
		) {
			originalRequest._retry = true

			try {
				await refreshAccessToken()

				// Повторяем оригинальный запрос с новым токеном
				originalRequest.headers[
					'Authorization'
				] = `Bearer ${authStore.accessToken}`
				return baseApi(originalRequest)
			} catch (refreshError) {
				// Если обновление токена не удалось - выходим из системы
				logout()
				if (window.location.pathname !== '/auth') {
					window.location.href = '/auth'
				}
				throw refreshError
			}
		}

		return Promise.reject(error)
	}
)

export default baseApi
