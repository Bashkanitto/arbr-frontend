/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select, Skeleton } from '@mantine/core'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { fetchVendorGroups, patchStatus } from '@services/productService'
import NotificationStore from '@features/notification/model/NotificationStore'
import { Table } from '@shared/ui/Table'
import styles from './ApplicationTabble.module.scss'
import Status from '../../../shared/utils/status'
import { Pagination } from '@shared/ui/Pagination/Pagination'

export const ApplicationTableAdmin = () => {
  const [productData, setProductData] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState<string | null>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [pageSize] = useState<number>(7)
  const [totalPages, setTotalPages] = useState<number>(1)

  useEffect(() => {
    // загрузка данных
    const loadVendors = async () => {
      setLoading(true)
      setError(null)
      try {
        const response: any = await fetchVendorGroups(page, pageSize)
        setProductData(response.data.records)
        setTotalPages(
          response.data.meta?.totalPages || Math.ceil(response.data.records.length / pageSize)
        )
      } catch (err) {
        setError('Не удалось загрузить данные')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadVendors()
  }, [page, pageSize])

  const handleStatusChange = async (productId: number, newStatus: 'active' | 'inactive') => {
    try {
      setProductData(prevData =>
        prevData.map(item =>
          item.product?.id === productId
            ? { ...item, product: { ...item.product, status: newStatus } }
            : item
        )
      )
      await patchStatus(productId, newStatus)
      NotificationStore.addNotification(
        'Заявка',
        `Заявка продукта под номером ${productId} успешно изменена`,
        'success'
      )
    } catch (error: any) {
      setError('Не удалось изменить статус продукта')
      console.error(error)

      const revertedData = productData.map(item =>
        item.product?.id === productId
          ? { ...item, product: { ...item.product, status: 'active' } } // Assuming "active" is the previous status
          : item
      )
      setProductData(revertedData)

      NotificationStore.addNotification(
        'Заявка',
        `Произошла ошибка при попытке измененить заявку`,
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Skeleton />
  if (error) return <div>Ошибка: {error}</div>

  // Логика фильтрации данных по запросу поиска
  const validData = productData.filter(item => item.product !== null)

  const filteredData = validData.filter(item => {
    const productName = item.product?.name.toLowerCase() || ''
    return productName.includes(searchQuery.toLowerCase())
  })

  // Логика фильтрации по статусу
  const filteredByStatus = statusFilter
    ? filteredData.filter(group => group.product.status === statusFilter)
    : filteredData

  const renderRow = () => {
    return filteredByStatus.map(item => {
      return (
        <Table.Tr key={item.id}>
          <Table.Td>{item.product?.id}</Table.Td>
          <Table.Td>
            <a className="underline" href={`/product/${item.product?.id}`}>
              {item.product?.name}
            </a>
          </Table.Td>
          <Table.Td>{item.vendor.firstName}</Table.Td>
          <Table.Td>
            <Status>{item.product?.status}</Status>
          </Table.Td>
          <Table.Td>
            {format(new Date(item.createdAt), 'dd MMMM, yyyy', {
              locale: ru,
            })}
          </Table.Td>
          <Table.Td
            style={{
              textAlign: 'end',
              display: 'flex',
              gap: '5px',
              justifyContent: 'flex-end',
            }}
          >
            <button
              className={styles.statusNotBt}
              onClick={() => handleStatusChange(item.product?.id, 'inactive')}
            >
              <img src="/images/diskLike_photo.svg" alt="" />
            </button>
            <button
              className={styles.statusYesBtn}
              onClick={() => handleStatusChange(item.product?.id, 'active')}
            >
              <img src="/images/like_photo.svg" alt="" />
            </button>
          </Table.Td>
        </Table.Tr>
      )
    })
  }

  return (
    <>
      <div className={styles['security-page-table-head']}>
        <div>
          <input
            type="text"
            placeholder="Поиск"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Select
            placeholder="Статус"
            defaultValue={statusFilter}
            data={[
              { value: '', label: 'Все' },
              { value: 'active', label: 'Разрешено' },
              { value: 'pending', label: 'В ожидании' },
              { value: 'inactive', label: 'Отклонено' },
            ]}
            onChange={value => setStatusFilter(value)}
          />
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={newPage => setPage(newPage)}
        />
      </div>
      <div className={styles['security-page-table']}>
        <Table stickyHeader>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID продукта</Table.Th>
              <Table.Th>Продукт</Table.Th>
              <Table.Th>Продавец</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Статус</Table.Th>
              <Table.Th>Дата</Table.Th>
              <Table.Th style={{ textAlign: 'end' }}>Действие</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{renderRow()}</Table.Tbody>
        </Table>
      </div>
    </>
  )
}
