import { UserType } from '../../../store/Types'
import { baseApi } from '../base'

interface LoginResponse {
	accessToken: string
	refreshToken: string
}

// Helper function to save tokens to local storage
const setTokens = (accessToken: string, refreshToken: string) => {
	localStorage.setItem('accessToken', accessToken)
	localStorage.setItem('refreshToken', refreshToken)
}

// –––––––––––––––––––––––––––––––Login –––––––––––––––––––––––––––––––
export const login = async (
	identifier: string,
	password: string
): Promise<LoginResponse> => {
	try {
		// Note: Removing the type from AxiosResponse<LoginResponse> because we need the tokens directly
		const response: { accessToken: string; refreshToken: string } =
			await baseApi.post('/auth/login', {
				identifier,
				password,
			})

		// Extract tokens directly from the response
		const { accessToken, refreshToken } = response

		// Save tokens
		setTokens(accessToken, refreshToken)

		// Return tokens as the expected LoginResponse type
		return { accessToken, refreshToken }
	} catch (error) {
		console.error('Login failed:', error)
		throw error
	}
}

// –––––––––––––––––––––––––––––––Fetch Profile–––––––––––––––––––––––––––––––
export const fetchProfile = async (): Promise<UserType> => {
	try {
		const response: UserType = await baseApi.get(`/account/profile`)
		console.log('in api -', response)
		return response
	} catch (error) {
		console.error('Failed to fetch account:', error)
		throw error
	}
}
