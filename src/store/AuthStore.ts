import { makeAutoObservable, runInAction } from 'mobx'
import {
	fetchProfile,
	login as loginApi,
} from '../services/api/auth/authService'
import { UserType } from './Types'

class AuthStore {
	accessToken: string | null = localStorage.getItem('accessToken')
	refreshToken: string | null = localStorage.getItem('refreshToken')
	userProfile: UserType | null = null
	loading: boolean = false

	constructor() {
		makeAutoObservable(this)
	}

	async login(identifier: string, password: string) {
		this.loading = true
		try {
			const { accessToken, refreshToken } = await loginApi(identifier, password)

			runInAction(() => {
				this.accessToken = accessToken
				this.refreshToken = refreshToken
				localStorage.setItem('accessToken', accessToken)
				localStorage.setItem('refreshToken', refreshToken)
			})

			await this.getProfile()
		} catch (error) {
			console.error('Login failed:', error)
		} finally {
			runInAction(() => {
				this.loading = false
			})
		}
	}

	async getProfile() {
		try {
			const profileData = await fetchProfile()
			console.log('in store -', profileData)
			runInAction(() => {
				this.userProfile = profileData
			})
		} catch (error) {
			console.error('Fetching profile failed:', error)
		}
	}

	//TODO set timer for logout
	logout() {
		this.accessToken = null
		this.refreshToken = null
		this.userProfile = null
		localStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')
	}

	get isLoggedIn() {
		return !!this.accessToken
	}
}

const authStore = new AuthStore()
export default authStore
