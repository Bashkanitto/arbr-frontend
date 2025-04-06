import baseApi from './base'

export const fetchLogger = async () => {
  try {
    const response: any = await baseApi.get(`/logger`, {
      // headers: { Accept: "text/plain" },
      responseType: 'text',
    })
    return response
  } catch (error) {
    console.error('Error updating bonus:', error)
    throw new Error('Error updating bonus')
  }
}

export const fetchPaymentRequest = async () => {
  try {
    const response: any = await baseApi.get(`/balance-log/waits`)
    return response
  } catch (error) {
    console.error('Error updating bonus:', error)
    throw new Error('Error updating bonus')
  }
}

export const patchPaymentRequest = async (id: number, status: string) => {
  try {
    const response: any = await baseApi.patch(`/balance-log/waits/:`, status)
    return response
  } catch (error) {
    console.error('Error updating bonus:', error)
    throw new Error('Error updating bonus')
  }
}
