/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select, Skeleton } from '@mantine/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchAllOrders, fetchOrders } from '@services/productService'
import { Table } from '@shared/ui/Table'
import styles from './MyOrdersTable.module.scss'
import baseApi from '@services/base'
import NotificationStore from '@features/notification/model/NotificationStore'
import { Pagination } from '@shared/ui/Pagination/Pagination'
import { OrderType } from '@shared/types/OrdersType'

const STATUS_OPTIONS = [
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

export const OrdersTable = () => {
  const [orders, setOrders] = useState<OrderType[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const pageSize = 7

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchAllOrders()
      const sorted = [...response.data.records].sort((a, b) => b.id - a.id)
      setOrders(sorted)
    } catch {
      setError('Не удалось загрузить заказы')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await baseApi.patch(`/order/${id}`, { status })
      setOrders(prev => prev.map(order => (order.id === id ? { ...order, status } : order)))
      NotificationStore.addNotification('Заказ', `Статус заказа ${id} изменен успешно`, 'success')
    } catch {
      NotificationStore.addNotification('Заказ', 'Ошибка при изменении статуса заказа', 'error')
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesStatus = statusFilter ? o.status === statusFilter : true
      const search = searchQuery.toLowerCase()

      const matchesSearch =
        o.announcementNumber?.toString().toLowerCase().includes(search) ||
        o.announcementNumberEcc?.toString().toLowerCase().includes(search) ||
        o.user?.firstName?.toLowerCase().includes(search) ||
        o.cartItems[0]?.product?.name?.toLowerCase().includes(search)

      return matchesStatus && (searchQuery ? matchesSearch : true)
    })
  }, [orders, statusFilter, searchQuery])

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredOrders.slice(start, start + pageSize)
  }, [filteredOrders, page, pageSize])

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1

  if (loading) return <Skeleton />
  if (error) return <div>Error: {error}</div>

  return (
    <>
      <div className={styles['security-page-table-head']}>
        <div>
          <input
            type="text"
            placeholder="Поиск"
            onChange={e => {
              setSearchQuery(e.target.value)
              setPage(1) // сброс на первую страницу
            }}
          />
          <Select
            placeholder="Статус"
            value={statusFilter}
            data={[{ value: '', label: 'Все' }, ...STATUS_OPTIONS]}
            onChange={value => {
              setStatusFilter(value || '')
              setPage(1) // сброс на первую страницу
            }}
          />
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
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

          <Table.Tbody>
            {paginatedOrders.map(item => (
              <Table.Tr key={item.id}>
                <Table.Td>
                  <a
                    href={
                      item.announcementNumber
                        ? `https://goszakup.gov.kz/ru/announce/index/${item.announcementNumber}?tab=lots`
                        : `https://fms.ecc.kz/ru/announce/index/${item.announcementNumberEcc}?tab=lots`
                    }
                  >
                    {item.announcementNumber ?? item.announcementNumberEcc}
                  </a>
                </Table.Td>
                <Table.Td>{item.user?.firstName ?? 'Неизвестно'}</Table.Td>
                <Table.Td>
                  {item.cartItems[0]?.product ? (
                    <a className="underline" href={`/product/${item.cartItems[0].product.id}`}>
                      {item.cartItems[0].product.name}
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
                    data={STATUS_OPTIONS}
                    onChange={value => value && handleStatusChange(item.id, value)}
                    size="sm"
                  />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </>
  )
}
