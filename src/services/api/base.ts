import axios from 'axios'
import { env } from '../../configs/env.config'
import authStore from '../../store/AuthStore'

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
	error => Promise.reject(error)
)

export default baseApi
