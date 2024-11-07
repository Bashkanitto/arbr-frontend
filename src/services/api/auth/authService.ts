import { AxiosResponse } from 'axios'
import { UserType } from '../../../store/Types'
import { baseApi } from '../base'

interface LoginResponse {
	accessToken: string
	refreshToken: string
}

const setTokens = (accessToken: string, refreshToken: string) => {
	localStorage.setItem('accessToken', accessToken)
	localStorage.setItem('refreshToken', refreshToken)
}

// Function to login
export const login = async (
	identifier: string,
	password: string
): Promise<LoginResponse> => {
	try {
		const response: AxiosResponse<LoginResponse> = await baseApi.post(
			'/auth/login',
			{
				identifier,
				password,
			}
		)
		// Save tokens
		setTokens(response.data.accessToken, response.data.refreshToken)
		return response.data
	} catch (error) {
		console.error('Login failed:', error)
		throw error
	}
}

// –––––––––––––––––––––––––––––––Fetch Profile–––––––––––––––––––––––––––––––
export const fetchAccount = async (): Promise<UserType> => {
	try {
		const response: AxiosResponse<UserType> = await baseApi.get(
			`/account/profile`
		)
		return response.data
	} catch (error) {
		console.error('Failed to fetch account:', error)
		throw error
	}
}
