import { Skeleton } from '@mantine/core'
import { useEffect, useState } from 'react'
import { UserType } from '@services/api/Types'
import { fetchAllVendors } from '@services/api/productService'
import Tender from '@components/molecules/Tender/Tender'
import CatalogSwitch from '../CatalogPage/CatalogSwitch/CatalogSwitch'
import SearchFilters from './SearchFilters/SearchFilters'
import styles from './SearchPage.module.scss'

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const [vendorData, setVendorData] = useState<UserType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const customerLength = vendorData.length
  // Fetch vendor details on component mount
  useEffect(() => {
    const loadVendors = async () => {
      try {
        setLoading(true)
        const response = await fetchAllVendors()
        if (response) {
          setVendorData(response.data.records)
        } else {
          setError('Failed to load vendor data: response is undefined')
        }
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

  if (loading) return <Skeleton />
  if (error) return <p>Error: {error}</p>

  // Фильтрация данных на основе запроса
  const filteredUserData = vendorData.filter(user =>
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles['search-page']}>
      <CatalogSwitch />
      <p className={styles['search-title']}>Поиск</p>
      <p className={styles['search-description']}>{customerLength} специалистов</p>
      <SearchFilters setSearchTerm={setSearchQuery} />
      <div className={styles['search-tenders']}>
        <div className={styles['catalog-tenders']}>
          {filteredUserData.map(vendor => (
            <Tender key={vendor.id} user={vendor} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
