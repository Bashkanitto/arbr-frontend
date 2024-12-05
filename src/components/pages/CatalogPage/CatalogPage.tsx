import { Skeleton } from '@mantine/core'
import { useEffect, useState } from 'react'
import { fetchProfile } from '../../../services/api/authService'
import { fetchAllVendors } from '../../../services/api/productService'
import { VendorType } from '../../../services/api/Types'
import Tender from '../../molecules/Tender/Tender'
import AddCatalogModal from './AddCatalogModal/AddCatalogModal'
import AddProductModal from './AddProductModal/AddProductModal'
import CatalogFilters from './CatalogFilter/CatalogFilters'
import styles from './CatalogPage.module.scss'
import CatalogSwitch from './CatalogSwitch/CatalogSwitch'

const CatalogPage = () => {
	// Local state for vendors, loading, and errors
	const [filterPeriod, setFilterPeriod] = useState<string | null>('3_months')
	const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false)
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
				const profileData = await fetchProfile()
				let filteredVendors = response.records

				// Применяем фильтр периода
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

				if (profileData.role != 'admin') {
					filteredVendors = filteredVendors.filter(
						vendor => vendor.firstName === profileData.firstName
					)
				}

				setVendorData(filteredVendors)
			} catch (err: unknown) {
				setError(`Failed to load vendor data: ${err}`)
			} finally {
				setLoading(false)
			}
		}
		loadVendors()
	}, [filterPeriod])

	// Toggle catalog modal
	const addCatalog = () => setIsAddCatalogOpen(true)
	const addProduct = () => setIsAddProductOpen(true)
	const topVendorsQuantity = vendorData.length

	if (loading) return <Skeleton />
	if (error) return <p>Error: {error}</p>

	return (
		<div className={styles['catalog-page']}>
			<CatalogSwitch />
			<p className={styles['catalog-title']}>Каталог</p>
			<p className={styles['catalog-description']}>
				Топ - {topVendorsQuantity}
			</p>
			<CatalogFilters
				onFilterChange={setFilterPeriod}
				addCatalog={addCatalog}
				addProduct={addProduct}
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
			{isAddProductOpen && (
				<AddProductModal
					isOpen={isAddProductOpen}
					onClose={() => setIsAddProductOpen(false)}
				/>
			)}
		</div>
	)
}

export default CatalogPage
