import { useEffect, useState } from 'react'
import { fetchAllVendors } from '../../../services/api/productService'
import { VendorType } from '../../../services/api/Types'
import Tender from '../../molecules/Tender/Tender'
import AddCatalogModal from './AddCatalogModal/AddCatalogModal'
import CatalogFilters from './CatalogFilter/CatalogFilters'
import styles from './CatalogPage.module.scss'
import CatalogSwitch from './CatalogSwitch/CatalogSwitch'

const CatalogPage = () => {
	// Local state for vendors, loading, and errors
	const [vendorData, setVendorData] = useState<VendorType[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [isAddCatalogOpen, setIsAddCatalogOpen] = useState<boolean>(false)

	// Fetch vendor details on component mount
	useEffect(() => {
		const loadVendors = async () => {
			try {
				setLoading(true)
				const response = await fetchAllVendors()
				setVendorData(response.records)
			} catch (err: unknown) {
				setError(
					err instanceof Error
						? `Failed to load vendor data: ${err.message}`
						: 'An unknown error occurred'
				)
			} finally {
				setLoading(false)
			}
		}
		loadVendors()
	}, [])

	// Toggle catalog modal
	const addCatalog = () => setIsAddCatalogOpen(true)

	if (loading) return <p>Loading vendor data...</p>
	if (error) return <p>Error: {error}</p>

	return (
		<div className={styles['catalog-page']}>
			<CatalogSwitch />
			<p className={styles['catalog-title']}>Каталог</p>
			<p className={styles['catalog-description']}>Топ - 50</p>
			<CatalogFilters addCatalog={addCatalog} />
			<div className={styles['catalog-tenders']}>
				{vendorData.map(vendor => (
					<Tender key={vendor.id} user={vendor} />
				))}
			</div>
			{isAddCatalogOpen && (
				<AddCatalogModal
					isOpen={isAddCatalogOpen}
					onClose={() => setIsAddCatalogOpen(false)}
				/>
			)}
		</div>
	)
}

export default CatalogPage
