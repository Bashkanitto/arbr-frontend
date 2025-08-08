import { useEffect, useState, useCallback } from 'react'
import { fetchProfile } from '@services/authService'
import { fetchAllVendors } from '@services/productService'
import Tender from '@entities/product/ui/Tender'
import styles from './CatalogTable.module.scss'
import { Skeleton } from '@mantine/core'
import { Box } from '@shared/ui/Box'
import CatalogFilters from '../CatalogFilter/CatalogFilters'
import AddCatalogModal from '../AddCatalogModal/AddCatalogModal'
import AddProductModal from '../AddProductModal/AddProductModal'
import { UserType } from '@shared/types/UserType'

const CatalogTable = () => {
  const [filterPeriod, setFilterPeriod] = useState<'3_months' | '6_months' | '1_year'>('3_months')
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isAddCatalogOpen, setIsAddCatalogOpen] = useState(false)
  const [vendors, setVendors] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const calculateStartDate = useCallback((period: string): Date => {
    const date = new Date()
    if (period === '3_months') date.setMonth(date.getMonth() - 3)
    else if (period === '6_months') date.setMonth(date.getMonth() - 6)
    else if (period === '1_year') date.setFullYear(date.getFullYear() - 1)
    return date
  }, [])

  const loadVendors = useCallback(async () => {
    try {
      setLoading(true)
      const [vendorsResponse, profileData] = await Promise.all([fetchAllVendors(), fetchProfile()])

      let filteredVendors = vendorsResponse.data?.records || []

      // Фильтрация по периоду
      const periodStart = calculateStartDate(filterPeriod)
      filteredVendors = filteredVendors.filter(
        (vendor: any) => new Date(vendor.createdAt) >= periodStart
      )

      // Фильтрация по пользователю
      if (profileData.role !== 'admin') {
        filteredVendors = filteredVendors.filter(
          (vendor: any) => vendor.firstName === profileData.firstName
        )
      }

      setVendors(filteredVendors)
    } catch (err) {
      setError(`Failed to load vendor data: ${err}`)
    } finally {
      setLoading(false)
    }
  }, [filterPeriod, calculateStartDate])

  useEffect(() => {
    loadVendors()
  }, [loadVendors])

  const toggleAddCatalog = () => setIsAddCatalogOpen(prev => !prev)
  const toggleAddProduct = () => setIsAddProductOpen(prev => !prev)

  return (
    <Box className={styles['catalog-page']}>
      {/* <p className={styles['catalog-title']}>Каталог</p> */}
      {/* <p className={styles['catalog-description']}>Топ - {vendorData.length}</p> */}
      <CatalogFilters
        onFilterChange={setFilterPeriod}
        addCatalog={toggleAddCatalog}
        addProduct={toggleAddProduct}
        filterPeriod={filterPeriod}
      />
      <div className={styles['catalog-tenders']}>
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                style={{ marginBottom: '30px' }}
                width="100%"
                height={200}
                radius={30}
              />
            ))
          : vendors.map(
              vendor => vendor.vendorGroups.length !== 0 && <Tender key={vendor.id} user={vendor} />
            )}
      </div>
      {isAddCatalogOpen && <AddCatalogModal isOpen={isAddCatalogOpen} onClose={toggleAddCatalog} />}
      {isAddProductOpen && <AddProductModal isOpen={isAddProductOpen} onClose={toggleAddProduct} />}
      {error && <p className={styles['error']}>{error}</p>}
    </Box>
  )
}

export default CatalogTable
