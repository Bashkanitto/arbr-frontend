// productService.js
export async function fetchProducts() {
	try {
		const response = await fetch('/product') // Update with the actual base URL if needed
		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`)
		}
		const data = await response.json()
		return data
	} catch (error) {
		console.error('Failed to fetch products:', error)
		return []
	}
}
