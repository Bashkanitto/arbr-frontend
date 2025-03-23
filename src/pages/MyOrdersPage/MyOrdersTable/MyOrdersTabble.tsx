/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select, Skeleton } from '@mantine/core'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { fetchMyOrders } from '@services/api/productService'
import { Table } from '@components/atoms/Table'
import styles from './MyOrdersTable.module.scss'
import { Pagination } from '@components/molecules/Pagination/Pagination'

export const MyOrdersTable = () => {
  const [productData, setProductData] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState<string | null>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [pageSize] = useState<number>(7)
  const [totalPages, setTotalPages] = useState<number>(1)

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const { records, meta }: any = await fetchMyOrders(page, pageSize)
        setTotalPages(meta?.totalPages || Math.ceil(records.length / pageSize))
        setProductData(records)
      } catch (err) {
        setError('Failed to load products')
        console.error(err)
        setProductData([])
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [page, pageSize])

  if (loading) return <Skeleton />
  if (error) return <div>Error: {error}</div>

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'pending':
        return 'warning'
      case 'cancelled':
        return 'danger'
      default:
        return ''
    }
  }

  const getLocalizedStatus = (status: string): string => {
    switch (status) {
      case 'active':
        return 'Активен'
      case 'pending':
        return 'В ожидании'
      case 'cancelled':
        return 'Отклонён'
      default:
        return 'Неизвестно'
    }
  }

  const renderRow = () => {
    const filteredData = statusFilter
      ? productData.filter(item => item.product.status === statusFilter)
      : productData

    if (!Array.isArray(filteredData)) return null

    return filteredData.map(item => (
      <Table.Tr key={item.id}>
        <Table.Td>{item.id}</Table.Td>
        <Table.Td>{item.user?.firstName ?? 'Неизвестно'}</Table.Td>
        <Table.Td className={styles.statusRow}>
          <p
            className={`${styles.status} ${getStatusColor(
              item.status
            )} ${getStatusColor(item.status)}bg`}
          >
            {getLocalizedStatus(item.status)}
          </p>
        </Table.Td>
        <Table.Td>
          <a href={`/product/${item.cartItems[0].product.id}`}>смотреть</a>
        </Table.Td>
        <Table.Td style={{ textAlign: 'end' }}>
          {format(new Date(item.createdAt), 'dd MMMM, yyyy', {
            locale: ru,
          })}
        </Table.Td>
      </Table.Tr>
    ))
  }

  return (
    <>
      <div className={styles['security-page-table-head']}>
        <div>
          <input type="text" placeholder="Поиск" />
          <Select
            placeholder="Статус"
            value={statusFilter}
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
              <Table.Th>ID заказа</Table.Th>
              <Table.Th>Покупатель</Table.Th>
              <Table.Th>Статус</Table.Th>
              <Table.Th>Продукт</Table.Th>
              <Table.Th style={{ textAlign: 'end' }}>Дата</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{renderRow()}</Table.Tbody>
        </Table>
      </div>
    </>
  )
}
