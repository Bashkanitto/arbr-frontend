/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Skeleton } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProfile } from '@services/api/authService'
import { fetchVendorById } from '@services/api/productService'
import { UserType } from '@services/api/Types'
import AddCatalogModal from '../CatalogPage/AddCatalogModal/AddCatalogModal'
import AddProductModal from '../CatalogPage/AddProductModal/AddProductModal'
import CatalogFilters from '../CatalogPage/CatalogFilter/CatalogFilters'
import styles from './VendorPage.module.scss'

const VendorPage = () => {
  const [filterPeriod, setFilterPeriod] = useState<string | null>('3_months')
  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [vendorData, setVendorData] = useState<UserType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddCatalogOpen, setIsAddCatalogOpen] = useState<boolean>(false)
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // Fetch profile data only once on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchProfile()
        setProfileData(profile)
      } catch (err) {
        setError(`Failed to load profile: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
    loadProfile()
  }, [])

  // Fetch vendor data when profile data or id changes
  useEffect(() => {
    const loadVendorData = async () => {
      if (!profileData) return // Don't fetch if profile data isn't loaded yet

      try {
        setLoading(true)
        let vendorId = profileData.id

        // Если роль не admin, показываем только свои данные
        if (profileData.role !== 'admin') {
          const response = await fetchVendorById(vendorId)
          setVendorData(response.data.records)
        } else {
          // Для админов — если в URL есть id и это число, используем его
          if (id && !isNaN(Number(id))) {
            const response = await fetchVendorById(id)
            setVendorData(response.data.records)
          } else {
            const response = await fetchVendorById(vendorId)
            setVendorData(response.data.records)
          }
        }
      } catch (err: unknown) {
        setError(
          `Failed to load vendor data: ${err instanceof Error ? err.message : 'Unknown error'}`
        )
      } finally {
        setLoading(false)
      }
    }

    loadVendorData()
  }, [profileData, id])

  // Функции для управления модальными окнами
  const addCatalog = () => setIsAddCatalogOpen(true)
  const addProduct = () => setIsAddProductOpen(true)

  // Лоадер на время загрузки данных
  if (loading) return <Skeleton />
  if (error) return <p>Error: {error}</p>

  return (
    <div className={styles['catalog-page']}>
      <>
        <Avatar w={100} h={100} />
        <p>{vendorData[0]?.firstName}</p>
      </>

      <CatalogFilters
        isAdmin={false}
        onFilterChange={setFilterPeriod}
        addCatalog={addCatalog}
        addProduct={addProduct}
        filterPeriod={filterPeriod}
      />

      <div className={styles['catalog-tenders']}>
        {vendorData.length > 0 ? (
          vendorData[0]?.vendorGroups
            ?.map(vendor => (
              <div
                onClick={() => navigate(`/product/${vendor.product.id}`)}
                className={styles.catalogItem}
                key={vendor.id}
              >
                <img
                  src={
                    vendor.product.images && vendor.product.images.length > 0 ? (
                      vendor.product.images[0].url.replace(
                        'http://3.76.32.115:3000',
                        'https://api.arbr.kz'
                      )
                    ) : (
                      <Skeleton width={200} height={200} radius={300} />
                    )
                  }
                  alt={vendor.product.name || 'Product image'}
                />
                <p>{vendor.product.name}</p>
              </div>
            ))
            .reverse()
        ) : (
          <p>Нет доступных товаров</p>
        )}
      </div>

      {isAddCatalogOpen && (
        <AddCatalogModal isOpen={isAddCatalogOpen} onClose={() => setIsAddCatalogOpen(false)} />
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
