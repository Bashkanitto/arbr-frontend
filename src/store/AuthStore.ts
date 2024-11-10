// –––––––––––––––––––––––––––––––––– AuthStore.ts ––––––––––––––––––––––––––––––––––

import Cookies from 'js-cookie'
import { makeAutoObservable, runInAction } from 'mobx'
import {
	fetchProfile,
	login as loginApi,
	logout as logoutApi,
} from '../services/api/auth/authService'
import { UserType } from './Types'

class AuthStore {
	accessToken = Cookies.get('accessToken')
	refreshToken = Cookies.get('refreshToken')
	userProfile: UserType | null = null
	loading = false

	constructor() {
		makeAutoObservable(this)
		this.loadUserProfileFromCookies()
	}

	private loadUserProfileFromCookies() {
		const savedProfile = Cookies.get('userProfile')
		if (savedProfile) {
			this.userProfile = JSON.parse(savedProfile)
		}
	}

	// –––––––––––––––––––––––––––––––Login–––––––––––––––––––––––––––––––
	async login(identifier: string, password: string) {
		this.loading = true
		try {
			const response = await loginApi(identifier, password)
			const { accessToken, refreshToken } = response

			runInAction(() => {
				this.accessToken = accessToken
				this.refreshToken = refreshToken
				Cookies.set('accessToken', accessToken, { expires: 1 })
				Cookies.set('refreshToken', refreshToken, { expires: 1 })
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

	// –––––––––––––––––––––––––––––––Fetch Profile–––––––––––––––––––––––––––––––
	async getProfile() {
		try {
			const response = await fetchProfile()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const profileData: any = response

			runInAction(() => {
				this.userProfile = profileData
				Cookies.set('userProfile', JSON.stringify(profileData), { expires: 1 })
			})
		} catch (error) {
			console.error('Fetching profile failed:', error)
		}
	}

	// –––––––––––––––––––––––––––––––Logout–––––––––––––––––––––––––––––––
	logout() {
		runInAction(() => {
			this.accessToken = undefined
			this.refreshToken = undefined
			this.userProfile = null
		})
		logoutApi()
	}

	get isLoggedIn() {
		return Boolean(this.accessToken)
	}
}

const authStore = new AuthStore()
export default authStore
