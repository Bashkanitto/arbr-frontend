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
	const [filterPeriod, setFilterPeriod] = useState<string | null>(null)
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
				let filteredVendors = response.records

				if (filterPeriod) {
					const currentDate = new Date()
					const periodStart = new Date()

					switch (filterPeriod) {
						case '3_months':
							periodStart.setMonth(currentDate.getMonth() - 3)
							break
						case '6_months':
							periodStart.setMonth(currentDate.getMonth() - 6)
							break
						case '1_year':
							periodStart.setFullYear(currentDate.getFullYear() - 1)
							break
						default:
							break
					}

					filteredVendors = filteredVendors.filter(
						vendor => new Date(vendor.createdAt) >= periodStart
					)
				}

				setVendorData(filteredVendors)
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
	}, [filterPeriod])

	// Toggle catalog modal
	const addCatalog = () => setIsAddCatalogOpen(true)
	const top = vendorData.length

	if (loading) return <p>Loading vendor data...</p>
	if (error) return <p>Error: {error}</p>

	return (
		<div className={styles['catalog-page']}>
			<CatalogSwitch />
			<p className={styles['catalog-title']}>Каталог</p>
			<p className={styles['catalog-description']}>Топ - {top}</p>
			<CatalogFilters
				onFilterChange={setFilterPeriod}
				addCatalog={addCatalog}
				filterPeriod={filterPeriod}
			/>
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
