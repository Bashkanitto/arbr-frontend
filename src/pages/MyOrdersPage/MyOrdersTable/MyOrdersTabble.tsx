/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select, Skeleton } from '@mantine/core'
import { useEffect, useState } from 'react'
import { fetchMyOrders } from '@services/api/productService'
import { Table } from '@components/atoms/Table'
import styles from './MyOrdersTable.module.scss'
import { Pagination } from '@components/molecules/Pagination/Pagination'
import baseApi from '@services/api/base'

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
        const response: any = await fetchMyOrders(page, pageSize)
        setTotalPages(
          response.data.meta?.totalPages || Math.ceil(response.data.records.length / pageSize)
        )
        setProductData(response.data.records)
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

  async function handleStatusChange(id: number, status: string) {
    try {
      const response = await baseApi.patch(`/order/${id}`, { status })
      console.log(response)
    } catch (err) {
      console.log(err)
    }
  }

  if (loading) return <Skeleton />
  if (error) return <div>Error: {error}</div>

  const getLocalizedStatus = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'В ожидании'
      case 'completed':
        return 'Принят'
      case 'completing':
        return 'Завершение'
      case 'published':
        return 'Опубликовано'
      case 'not_happened':
        return 'Не завершен'
      case 'not_won':
        return 'Не выиграно'
      case 'cancelled':
        return 'Отменен'
      default:
        return 'Неизвестно'
    }
  }

  const getLocalizedPurchase = (purchase: string): string => {
    switch (purchase) {
      case 'directPurchase':
        return 'Прямой платеж'
      default:
        return 'Неизвестно'
    }
  }

  const renderRow = () => {
    const filteredData = statusFilter
      ? productData.filter(item => item.status === statusFilter)
      : productData

    if (!Array.isArray(filteredData)) return null

    return filteredData.map(item => (
      <Table.Tr key={item.id}>
        <Table.Td>{item.announcementNumber}</Table.Td>
        <Table.Td>{item.user?.firstName ?? 'Неизвестно'}</Table.Td>
        <Table.Td className={styles.statusRow}>{getLocalizedStatus(item.status)}</Table.Td>
        <Table.Td>
          {item.cartItems[0].product ? (
            <a href={`/product/${item.cartItems[0].product?.id}`}>смотреть</a>
          ) : (
            'нет продукта'
          )}
        </Table.Td>
        <Table.Td>{getLocalizedPurchase(item.type)}</Table.Td>
        <Table.Td>{item.deliveryAdress}</Table.Td>
        <Table.Td style={{ textAlign: 'end' }}>
          {new Intl.NumberFormat('en-KZ').format(item.amountPrice)}₸
        </Table.Td>
        <Table.Td>
          <button
            className={styles.statusNotBt}
            onClick={() => handleStatusChange(item.id, 'cancelled')}
          >
            <img src="/images/diskLike_photo.svg" alt="" />
          </button>
          <button
            className={styles.statusYesBtn}
            onClick={() => handleStatusChange(item.id, 'completed')}
          >
            <img src="/images/like_photo.svg" alt="" />
          </button>
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
              <Table.Th>Номер заказа</Table.Th>
              <Table.Th>Покупатель</Table.Th>
              <Table.Th>Статус</Table.Th>
              <Table.Th>Продукт</Table.Th>
              <Table.Th>Оплата</Table.Th>
              <Table.Th>Доставка</Table.Th>
              <Table.Th style={{ textAlign: 'end' }}>Цена</Table.Th>
              <Table.Th>Действие</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{renderRow()}</Table.Tbody>
        </Table>
      </div>
    </>
  )
}
