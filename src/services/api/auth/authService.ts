import { AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import { UserType } from '../../../store/Types'
import { baseApi } from '../base'

interface LoginResponse {
	accessToken: string
	refreshToken: string
}

const setTokens = (accessToken: string, refreshToken: string) => {
	localStorage.setItem('accessToken', accessToken)
	localStorage.setItem('refreshToken', refreshToken)
	Cookies.set('accessToken', accessToken, { expires: 1 })
	Cookies.set('refreshToken', refreshToken, { expires: 1 })
}

// –––––––––––––––––––––––––––––––Login–––––––––––––––––––––––––––––––

export const login = async (
	identifier: string,
	password: string
): Promise<LoginResponse> => {
	try {
		const response: LoginResponse = await baseApi.post('/auth/login', {
			identifier,
			password,
		})
		const { accessToken, refreshToken } = response

		setTokens(accessToken, refreshToken)

		return { accessToken, refreshToken }
	} catch (error) {
		console.error('Unknown error type:', error)
		throw new Error(`Login failed: Unknown error - ${error}`)
	}
}

// ––––––––––––––––––––––––––––––Log Out–––––––––––––––––––––––––––––––
export const logout = () => {
	localStorage.removeItem('accessToken')
	localStorage.removeItem('refreshToken')
	Cookies.remove('accessToken')
	Cookies.remove('refreshToken')
}

// Автоматический выход через 24 часа
export const setLogoutTimer = () => {
	setTimeout(logout, 24 * 60 * 60 * 1000)
}

// –––––––––––––––––––––––––––––––Fetch Profile–––––––––––––––––––––––––––––––
export const fetchProfile = async (): Promise<AxiosResponse<UserType>> => {
	try {
		const response: AxiosResponse<UserType> = await baseApi.get(
			'/account/profile'
		)
		return response
	} catch (error) {
		console.error('Unknown error type:', error)
		throw new Error(`Failed to fetch profile: Unknown error - ${error}`)
	}
}
