import Cookies from 'js-cookie'
import { makeAutoObservable, runInAction } from 'mobx'
import {
  fetchProfile,
  login as loginApi,
  logout as logoutApi,
  refreshToken as refreshTokenApi,
} from '../services/authService.js'
import { UserType } from '@shared/types/UserType.js'

class AuthStore {
  accessToken = Cookies.get('accessToken') || null
  refreshToken = Cookies.get('refreshToken') || null
  userProfile: UserType | null = null
  isAdmin: boolean = localStorage.getItem('isAdmin') === 'true' || false
  loading = false
  initialized = false
  
  // Приватное свойство для предотвращения множественных запросов обновления
  private refreshPromise: Promise<void> | null = null

  constructor() {
    // Упрощенная конфигурация без указания исключений
    makeAutoObservable(this)
    
    // Загружаем профиль из cookies сразу
    this.loadUserProfileFromCookies()
    this.initialize()
  }

  // Автообновление токена
  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      console.warn('No refresh token available')
      return false
    }
    
    // Предотвращаем множественные запросы на обновление
    if (this.refreshPromise) {
      try {
        await this.refreshPromise
        return Boolean(this.accessToken)
      } catch (error) {
        console.error('Refresh promise failed:', error)
        return false
      }
    }

    this.refreshPromise = this.performRefresh()
    try {
      await this.refreshPromise
      return Boolean(this.accessToken)
    } catch (error) {
      console.error('Token refresh failed:', error)
      this.logout()
      return false
    } finally {
      this.refreshPromise = null
    }
  }

  // Приватный метод для выполнения обновления токена
  private async performRefresh(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      console.log('Attempting to refresh token...')
      const response = await refreshTokenApi(this.refreshToken)
      
      runInAction(() => {
        this.accessToken = response.accessToken
        this.refreshToken = response.refreshToken
      })
      
      // Обновляем cookies
      Cookies.set('accessToken', response.accessToken, { expires: 1 })
      Cookies.set('refreshToken', response.refreshToken, { expires: 1 })
      
      console.log('Token refreshed successfully')
    } catch (error) {
      console.error('Failed to refresh token:', error)
      throw error
    }
  }

  // Приватная инициализация
  private async initialize() {
    try {
      if (this.accessToken) {
        // Если нет профиля в cookies, загружаем с сервера
        if (!this.userProfile) {
          try {
            await this.getProfile()
          } catch (error) {
            console.error('Failed to initialize profile:', error)
            this.logout()
          }
        }
      }
    } catch (error) {
      console.error('Initialization failed:', error)
    } finally {
      runInAction(() => {
        this.initialized = true
      })
    }
  }

  // Приватная загрузка профиля из cookies
  private loadUserProfileFromCookies() {
    const savedProfile = Cookies.get('userProfile')
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile)
        runInAction(() => {
          this.userProfile = parsedProfile
        })
      } catch (error) {
        console.error('Failed to parse saved profile:', error)
        Cookies.remove('userProfile')
      }
    }
  }

  // Геттеры для роутинга
  get isAuthenticated() {
    return Boolean(this.accessToken)
  }

  // Геттер для проверки готовности
  get isReady() {
    return this.initialized
  }

  // Проверка полной авторизации
  get isLoggedIn() {
    return Boolean(this.accessToken && this.userProfile)
  }

  // Метод логина
  async login(identifier: string, password: string) {
    runInAction(() => {
      this.loading = true
    })
    
    try {
      const response = await loginApi(identifier, password)
      const { accessToken, refreshToken } = response
      
      runInAction(() => {
        this.accessToken = accessToken
        this.refreshToken = refreshToken
      })
      
      // Сохраняем токены в cookies
      Cookies.set('accessToken', accessToken, { expires: 1 })
      Cookies.set('refreshToken', refreshToken, { expires: 1 })

      // Загружаем профиль пользователя
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
      throw error
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  // Получение профиля пользователя
  async getProfile() {
    try {
      const response = await fetchProfile()
      runInAction(() => {
        this.userProfile = response
      })
      // Сохраняем профиль в cookies
      Cookies.set('userProfile', JSON.stringify(response), { expires: 1 })
    } catch (error: unknown) {
      console.error('Fetching profile failed:', error)
      throw error
    }
  }

  // Выход из системы
  logout() {
    runInAction(() => {
      this.accessToken = null
      this.refreshToken = null
      this.userProfile = null
      this.isAdmin = false
      this.initialized = false
    })
    
    // Очищаем все сохраненные данные
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    Cookies.remove('userProfile')
    localStorage.removeItem('isAdmin')
    
    // Вызываем API для выхода
    try {
      logoutApi()
    } catch (error) {
      console.error('Logout API call failed:', error)
    }
  }

  // Метод для принудительного обновления профиля
  async refreshProfile() {
    if (!this.accessToken) {
      throw new Error('Not authenticated')
    }
    
    try {
      await this.getProfile()
    } catch (error) {
      console.error('Failed to refresh profile:', error)
      throw error
    }
  }

  // Проверка валидности токена
  get hasValidToken() {
    return Boolean(this.accessToken && this.refreshToken)
  }
}

const authStore = new AuthStore()
export default authStore