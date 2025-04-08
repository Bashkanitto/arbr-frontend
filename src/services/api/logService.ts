import baseApi from './base'

export const fetchLogger = async () => {
  try {
    const response: any = await baseApi.get(`/logger`, {
      // headers: { Accept: "text/plain" },
      responseType: 'text',
    })
    return response
  } catch (error) {
    console.error('Error updating logger:', error)
    throw new Error('Error updating logger')
  }
}

export const fetchPaymentRequest = async () => {
  try {
    const response: any = await baseApi.get(`/balance-log/waits`)
    return response
  } catch (error) {
    console.error('Error updating payment:', error)
    throw new Error('Error updating payment')
  }
}

export const patchPaymentRequest = async (paymentId: number) => {
  try {
    const response: any = await baseApi.get(`/balance-log/approve/${paymentId}`)
    return response
  } catch (error) {
    console.error('Error updating payment:', error)
    throw new Error('Error updating payment')
  }
}
