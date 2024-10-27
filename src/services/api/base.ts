import axios from 'axios'
import { env } from '../../configs/env.config'

export const baseApi = axios.create({
	baseURL: env.baseUrl,
})

baseApi.interceptors.request.use(
	config => {
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

baseApi.interceptors.response.use(
	response => {
		return response.data
	},
	error => {
		return Promise.reject(error)
	}
)
