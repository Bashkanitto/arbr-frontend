import { Avatar, Skeleton } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProfile } from '../../../services/api/authService'
import { fetchVendorById } from '../../../services/api/productService'
import { VendorType } from '../../../services/api/Types'
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
	const navigate = useNavigate()
	// Получаем id из параметров URL
	const { id } = useParams<{ id: string }>()

	useEffect(() => {
		const loadVendors = async () => {
			try {
				setLoading(true)

				const profileData = await fetchProfile()
				const vendorId = profileData.id
				let response
				if (id && !isNaN(Number(id))) {
					// Если id — это число, используем его
					response = await fetchVendorById(id)
				} else {
					// Если id не число, используем vendorId из профиля
					response = await fetchVendorById(vendorId)
				}

				// Фильтрация данных по роли (если роль не admin)
				let filteredVendors = response.records
				if (profileData.role !== 'admin') {
					filteredVendors = filteredVendors.filter(
						(vendor: { firstName: string }) =>
							vendor.firstName === profileData.firstName
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
	}, [id])

	// Функции для управления модальными окнами
	const addCatalog = () => setIsAddCatalogOpen(true)
	const addProduct = () => setIsAddProductOpen(true)

	// Лоадер на время загрузки данных
	if (loading) return <Skeleton />
	if (error) return <p>Error: {error}</p>

	return (
		<div className={styles['catalog-page']}>
			<p className={styles['catalog-title']}>Каталог</p>
			<Avatar w={200} h={200} />
			{vendorData[0].firstName}
			<CatalogFilters
				onFilterChange={setFilterPeriod}
				addCatalog={addCatalog}
				addProduct={addProduct}
				filterPeriod={filterPeriod}
			/>
			<div className={styles['catalog-tenders']}>
				{vendorData.length > 0 &&
					vendorData[0]?.vendorGroups.map(vendor => (
						<div
							onClick={item => navigate(`product/${vendor.id}`)}
							className={styles.catalogItem}
							key={vendor.id}
						>
							<img src={vendor.product?.images[0]?.url} alt='' />
							<p>{vendor.product.name}</p>
						</div>
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
