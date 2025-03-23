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
