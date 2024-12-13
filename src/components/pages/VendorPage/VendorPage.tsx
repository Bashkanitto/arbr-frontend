import { Skeleton } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProfile } from '../../../services/api/authService'
import { fetchVendorById } from '../../../services/api/productService'
import { VendorType } from '../../../services/api/Types'
import authStore from '../../../store/AuthStore'
import AddCatalogModal from '../CatalogPage/AddCatalogModal/AddCatalogModal'
import AddProductModal from '../CatalogPage/AddProductModal/AddProductModal'
import CatalogFilters from '../CatalogPage/CatalogFilter/CatalogFilters'
import styles from './VendorPage.module.scss'

const VendorPage = () => {
	// Local state for vendors, loading, and errors
	const [filterPeriod, setFilterPeriod] = useState<string | null>('3_months')
	const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false)
	const [vendorData, setVendorData] = useState<VendorType[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [isAddCatalogOpen, setIsAddCatalogOpen] = useState<boolean>(false)

	// Fetch vendor details on component mount
	const navigate = useNavigate()
	const { id } = useParams<{ id: string }>() // Get id from URL
	const { userProfile } = authStore // Get user profile data from store

	useEffect(() => {
		const loadVendors = async () => {
			try {
				setLoading(true)
				const profileData = await fetchProfile()

				// Determine the vendorId to use
				console.log(profileData.id)
				const vendorId = profileData.id

				const response = await fetchVendorById(vendorId)

				// Filter vendors based on user role if necessary
				let filteredVendors = response.records
				if (profileData.role !== 'admin') {
					filteredVendors = filteredVendors.filter(
						vendor => vendor.firstName === profileData.firstName
					)
				}

				setVendorData(filteredVendors)
			} catch (err: unknown) {
				setError(
					`Failed to load vendor data: ${
						err instanceof Error ? err.message : 'Unknown error'
					}`
				)
			} finally {
				setLoading(false)
			}
		}
		loadVendors()
	}, [id, navigate])

	// Toggle catalog modal
	const addCatalog = () => setIsAddCatalogOpen(true)
	const addProduct = () => setIsAddProductOpen(true)

	if (loading) return <Skeleton />
	if (error) return <p>Error: {error}</p>

	return (
		<div className={styles['catalog-page']}>
			<p className={styles['catalog-title']}>Каталог</p>
			<CatalogFilters
				onFilterChange={setFilterPeriod}
				addCatalog={addCatalog}
				addProduct={addProduct}
				filterPeriod={filterPeriod}
			/>
			<div className={styles['catalog-tenders']}>
				{vendorData.length > 0 &&
					vendorData[0].vendorGroups.map(vendor => (
						<div key={vendor.id}>{vendor.id}</div>
					))}
			</div>
			{isAddCatalogOpen && (
				<AddCatalogModal
					isOpen={isAddCatalogOpen}
					onClose={() => setIsAddCatalogOpen(false)}
				/>
			)}
			{isAddProductOpen && (
				<AddProductModal
					isOpen={isAddProductOpen}
					onClose={() => setIsAddProductOpen(false)}
				/>
			)}
		</div>
	)
}

export default VendorPage
