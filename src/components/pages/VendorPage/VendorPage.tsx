/* eslint-disable @typescript-eslint/no-explicit-any */
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
	const [profileData, setProfileData] = useState(0)
	const [vendorData, setVendorData] = useState<VendorType[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [isAddCatalogOpen, setIsAddCatalogOpen] = useState<boolean>(false)
	const navigate = useNavigate()
	const { id } = useParams<{ id: string }>()

	useEffect(() => {
		const loadVendors = async () => {
			try {
				setLoading(true)

				const profileData:any = await fetchProfile()
				setProfileData(profileData)
				const vendorId = profileData.id
				let response

				// Если роль не admin, показываем только свои данные
				if (profileData.role !== 'admin') {
					response = await fetchVendorById(vendorId)
				} else {
					// Для админов — если в URL есть id и это число, используем его
					if (id && !isNaN(Number(id))) {
						response = await fetchVendorById(id)
					} else {
						// Иначе используем vendorId из профиля
						response = await fetchVendorById(vendorId)
					}
				}

				// Устанавливаем данные о вендоре
				setVendorData(response.records)
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
			{vendorData.length > 0 && (
				<>
					<Avatar w={100} h={100} />
					<p>{vendorData[0]?.firstName}</p>
				</>
			)}

			<CatalogFilters
				isAdmin={false}
				onFilterChange={setFilterPeriod}
				addCatalog={addCatalog}
				addProduct={addProduct}
				filterPeriod={filterPeriod}
			/>



			<div className={styles['catalog-tenders']}>
				{vendorData.length > 0 ? (
					vendorData[0]?.vendorGroups.map((vendor) => (
						<div
							onClick={() => navigate(`/product/${vendor.product.id}`)}
							className={styles.catalogItem}
							key={vendor.id}
						>
							<img
								src={
									vendor.product.images && vendor.product.images.length > 0 ? (
										vendor.product.images[0].url.replace('http://3.76.32.115:3000', 'https://rbr.kz')
									) : (
										<Skeleton width={200} height={200} radius={300} />
									)
								}
								alt={vendor.product.name || 'Product image'}
							/>
							<p>{vendor.product.name}</p>
						</div>
					))
				) : (
					<p>Нет доступных товаров</p>
				)}
			</div>

			{isAddCatalogOpen && (
				<AddCatalogModal
					isOpen={isAddCatalogOpen}
					onClose={() => setIsAddCatalogOpen(false)}
				/>
			)}

			{isAddProductOpen && (
				<AddProductModal
					profileData={profileData}
					isAdmin={false}
					isOpen={isAddProductOpen}
					onClose={() => setIsAddProductOpen(false)}
				/>
			)}
		</div>
	)
}

export default VendorPage
