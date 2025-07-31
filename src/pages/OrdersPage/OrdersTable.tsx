/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select, Skeleton } from '@mantine/core'
import { useEffect, useState } from 'react'
import { fetchOrders } from '@services/productService'
import { Table } from '@shared/ui/Table'
import styles from './MyOrdersTable.module.scss'
import baseApi from '@services/base'
import NotificationStore from '@features/notification/model/NotificationStore'
import { Pagination } from '@shared/ui/Pagination/Pagination'

export const OrdersTable = () => {
  const [productData, setProductData] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState<string | null>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [pageSize] = useState<number>(7)
  const [totalPages, setTotalPages] = useState<number>(1)

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        const response: any = await fetchOrders(page, pageSize)
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
    loadOrders()
  }, [page, pageSize])

  async function handleStatusChange(id: number, status: string) {
    try {
      await baseApi.patch(`/order/${id}`, { status })
      const orderResponse: any = await fetchOrders(page, pageSize)
      setProductData(orderResponse.data.records)
      NotificationStore.addNotification('Заказ', 'Изменение статуса заказа успешна', 'success')
    } catch (err) {
      console.error(err)
      NotificationStore.addNotification('Заказ', 'Произошла ошибка при изменении заказа', 'error')
    }
  }

  if (loading) return <Skeleton />
  if (error) return <div>Error: {error}</div>

  const statusOptions = [
    { value: 'waiting_for_approve', label: 'Ждет подтверждения' },
    { value: 'pending', label: 'В ожидании' },
    { value: 'completed', label: 'Принят' },
    { value: 'completing', label: 'Завершение' },
    { value: 'published', label: 'Опубликовано' },
    { value: 'not_happened', label: 'Не завершен' },
    { value: 'not_won', label: 'Не выиграно' },
    { value: 'cancelled', label: 'Отменен' },
  ]

  const getLocalizedPurchase = (purchase: string): string => {
    switch (purchase) {
      case 'directPurchase':
        return 'Прямой платеж'
      case 'tender':
        return 'Тендер'
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
        <Table.Td>
          <a
            href={
              item.announcementNumber
                ? `https://goszakup.gov.kz/ru/announce/index/${item.announcementNumber}?tab=lots`
                : `https://fms.ecc.kz/ru/announce/index/${item.announcementNumberEcc}?tab=lots`
            }
          >
            {item.announcementNumber ? item.announcementNumber : item.announcementNumberEcc}
          </a>
        </Table.Td>
        <Table.Td>{item.user?.firstName ?? 'Неизвестно'}</Table.Td>
        <Table.Td>
          {item.cartItems[0].product ? (
            <a className="underline" href={`/product/${item.cartItems[0].product?.id}`}>
              {item.cartItems[0].product?.name}
            </a>
          ) : (
            'нет продукта'
          )}
        </Table.Td>
        <Table.Td>{getLocalizedPurchase(item.type)}</Table.Td>
        <Table.Td>{item.deliveryAdress}</Table.Td>
        <Table.Td>{new Intl.NumberFormat('en-KZ').format(item.amountPrice)}₸</Table.Td>
        <Table.Td>
          <Select
            value={item.status}
            data={statusOptions}
            onChange={value => value && handleStatusChange(item.id, value)}
            size="sm"
          />
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
              <Table.Th>Номер объявления</Table.Th>
              <Table.Th>Покупатель</Table.Th>
              <Table.Th>Продукт</Table.Th>
              <Table.Th>Оплата</Table.Th>
              <Table.Th>Доставка</Table.Th>
              <Table.Th>Цена</Table.Th>
              <Table.Th>Действие</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{renderRow()}</Table.Tbody>
        </Table>
      </div>
    </>
  )
}
