import baseApi from './base'

// –––––––––––––––––- Получение операции –––––––––––––
export const fetchOperations = async () => {
	try {
		const response: any = await baseApi.get('/balance/logs')
		return response
	} catch (error) {
		console.error('Error fetching operations:', error)
		throw new Error(
			`Failed to fetch operations: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		)
	}
}
