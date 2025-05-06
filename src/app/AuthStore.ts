import Cookies from 'js-cookie'
import { makeAutoObservable, runInAction } from 'mobx'
import {
  fetchProfile,
  login as loginApi,
  logout as logoutApi,
} from '../services/api/authService.js'
import { UserType } from '@services/api/Types.js'

class AuthStore {
  accessToken = Cookies.get('accessToken') || null
  refreshToken = Cookies.get('refreshToken') || null
  userProfile: UserType | null = null
  isAdmin: boolean = localStorage.getItem('isAdmin') === 'true' || false
  loading = false
  initialized = false

  constructor() {
    makeAutoObservable(this)
    this.initialize()
  }

  private async initialize() {
    if (this.accessToken && !this.userProfile) {
      try {
        await this.getProfile()
      } catch (error) {
        console.error('Failed to initialize profile:', error)
        this.logout()
      }
    }
    runInAction(() => {
      this.initialized = true
    })
  }

  private loadUserProfileFromCookies() {
    const savedProfile = Cookies.get('userProfile')
    if (savedProfile) {
      try {
        this.userProfile = JSON.parse(savedProfile)
      } catch (error) {
        console.error('Failed to parse saved profile:', error)
        Cookies.remove('userProfile')
      }
    }
  }

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

      // Проверка роли пользователя
      if (this.userProfile?.role === 'manager') {
        this.logout()
        throw new Error('Роль "manager" не поддерживается')
      }

      if (this.userProfile?.role === 'admin') {
        localStorage.setItem('isAdmin', 'true')
        runInAction(() => {
          this.isAdmin = true
        })
      }
    } catch (error: unknown) {
      console.error('Login failed:', error)
      throw error
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  async getProfile() {
    try {
      const response = await fetchProfile()
      runInAction(() => {
        this.userProfile = response
        Cookies.set('userProfile', JSON.stringify(response), { expires: 1 })
      })
    } catch (error: unknown) {
      console.error('Fetching profile failed:', error)
      throw error
    }
  }

  logout() {
    runInAction(() => {
      this.accessToken = null
      this.refreshToken = null
      this.userProfile = null
      this.initialized = false
    })
    Cookies.remove('accessToken')
    localStorage.removeItem('isAdmin')
    Cookies.remove('refreshToken')
    Cookies.remove('userProfile')
    logoutApi()
  }

  get isLoggedIn() {
    return Boolean(this.accessToken && this.userProfile)
  }
}

const authStore = new AuthStore()
export default authStore
