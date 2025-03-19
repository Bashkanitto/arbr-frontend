import baseApi from './base'

export const fetchLogger = async () => {
  try {
    const response = await baseApi.get(`/logger`, {
      // headers: { Accept: "text/plain" },
      responseType: 'text',
    })
    return response.data
  } catch (error) {
    console.error('Error updating bonus:', error)
    throw new Error('Error updating bonus')
  }
}
