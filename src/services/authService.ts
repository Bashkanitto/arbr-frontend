/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from 'js-cookie'
import { baseApi } from './base'
import { UserType } from '@shared/types/UserType'

interface LoginResponse {
  accessToken: string
  refreshToken: string
}

interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

interface SendOtpResponse {
  verifyOtpToken: string
}

interface ConfirmOtpResponse {
  email: string
  otpToken: string
}

const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('refreshToken', refreshToken)
  Cookies.set('accessToken', accessToken, { expires: 1 })
  Cookies.set('refreshToken', refreshToken, { expires: 1 })
}

// –––––––––––––––––––––––––––––––Login–––––––––––––––––––––––––––––––
export const login = async (identifier: string, password: string): Promise<LoginResponse> => {
  try {
    const response: any = await baseApi.post('/auth/login', {
      identifier,
      password,
    })
    const { accessToken, refreshToken } = response.data

    setTokens(accessToken, refreshToken)

    return { accessToken, refreshToken }
  } catch (error) {
    throw error
  }
}

// –––––––––––––––––––––––––––––––Refresh Token–––––––––––––––––––––––––––––––
export const refreshToken = async (refreshTokenValue: string): Promise<RefreshTokenResponse> => {
  try {
    const response: any = await baseApi.post('/auth/refresh', {
      refreshToken: refreshTokenValue,
    })
    
    const { accessToken, refreshToken: newRefreshToken } = response.data
    setTokens(accessToken, newRefreshToken)
    
    return { accessToken, refreshToken: newRefreshToken }
  } catch (error) {
    console.error('Token refresh failed:', error)
    throw new Error(`Token refresh failed: ${error}`)
  }
}

// ––––––––––––––––––––––––––––––Log Out–––––––––––––––––––––––––––––––
export const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  Cookies.remove('accessToken')
  Cookies.remove('refreshToken')

  if (window.location.pathname !== '/auth') {
    window.location.href = '/auth'
  }
}

// –––––––––––––––––––––––––––––––Данные пользователя–––––––––––––––––––––––––––––––
export const fetchProfile = async (): Promise<UserType> => {
  try {
    const response: any = await baseApi.get('/account/profile')
    return response.data
  } catch (error) {
    console.error('Unknown error type:', error)

    logout()
    if (window.location.pathname !== '/auth') {
      window.location.href = '/auth'
    }

    throw new Error(`Failed to fetch profile: Unknown error - ${error}`)
  }
}

// ––––––––––––––––––––––––––––––––––отправка кода–––––––––––––––––––––––––––––––
export const sendOtpResetPassword = async (identifier: string): Promise<void> => {
  try {
    const response: any = await baseApi.post<SendOtpResponse>('/otp/send-otp-reset-password', {
      identifier,
    })

    const { verifyOtpToken } = response.data
    
    if (!verifyOtpToken) {
      throw new Error('Сервер не вернул verifyOtpToken.')
    }
    localStorage.setItem('verifyOtpToken', verifyOtpToken)

  } catch (error: any) {
    throw error
  }
}

// ––––––––––––––––––––––––––––––––––Подтверждение кода –––––––––––––––––––––––––––––––
export const confirmOtpResetPassword = async (otpCode: string): Promise<void> => {
  try {
    const verifyOtpToken = localStorage.getItem('verifyOtpToken')
    if (!verifyOtpToken) {
      throw new Error('Сессия OTP отсутствует.')
    }

    const response: any = await baseApi.post<ConfirmOtpResponse>(
      '/otp/confirm-otp-reset-password',
      {
        otp_session: verifyOtpToken,
        otp: otpCode,
      }
    )

    const { email, otpToken } = response.data

    localStorage.setItem('otpToken', otpToken)
  } catch (error: any) {
    console.error('Ошибка подтверждения OTP:', error)
    throw new Error(error.response?.data?.message || 'Неправильный код OTP.')
  }
}

// ––––––––––––––––––––––––––––––––––Обновление пароля –––––––––––––––––––––––––––––––
export const updatePassword = async (password: string): Promise<void> => {
  try {
    const otpToken = localStorage.getItem('otpToken')

    if (!otpToken) {
      throw new Error('Сессия OTP отсутствует.')
    }

    await baseApi.post('/auth/update-password', {
      otp_session: otpToken,
      password,
    })

    // Очищаем данные после успешного обновления
    localStorage.removeItem('otpToken')
    localStorage.removeItem('otpLogin')
  } catch (error: any) {
    console.error('Ошибка обновления пароля:', error)
    throw new Error(error.response?.data?.message || 'Не удалось обновить пароль.')
  }
}