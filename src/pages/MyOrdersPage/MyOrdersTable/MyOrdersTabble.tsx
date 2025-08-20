/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select, Skeleton } from '@mantine/core'
import { useEffect, useState } from 'react'
import { Table } from '@shared/ui/Table'
import styles from './MyOrdersTable.module.scss'
import baseApi from '@services/base'
import NotificationStore from '@features/notification/model/NotificationStore'
import { fetchMyOrders } from '@services/productService'
import { fetchProfile } from '@services/authService'
import { Pagination } from '@shared/ui/Pagination/Pagination'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export const MyOrdersTable = () => {
  const [productData, setProductData] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState<string | null>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [profile, setProfile] = useState<any>()
  const [userEmail, setUserEmail] = useState<any>()
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [pageSize] = useState<number>(7)
  const [totalPages, setTotalPages] = useState<number>(1)

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const profileResponse: any = await fetchProfile()
        setUserEmail(profileResponse.email)
        setProfile(profileResponse)
        const response: any = await fetchMyOrders(page, pageSize, profileResponse.email)
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
      const orderResponse: any = await fetchMyOrders(page, pageSize, userEmail)
      setProductData(orderResponse.data.records)

      console.log(response)
      NotificationStore.addNotification('Заказ', 'Изменение статуса заказа успешна', 'success')
    } catch (err) {
      console.log(err)
      NotificationStore.addNotification('Заказ', 'Произошла ошибка при изменении заказа', 'error')
    }
  }

  if (loading) return <Skeleton />
  if (error) return <div>Error: {error}</div>

  const getLocalizedStatus = (status: string): string => {
    switch (status) {
      case 'waiting_for_approve':
        return 'Ждет подтверждения'
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
      case 'tender':
        return 'Тендер'
      default:
        return 'Неизвестно'
    }
  }

  const renderRow = () => {
    const filteredData = statusFilter
      ? productData.filter(item => item.status === statusFilter && item.user.id == profile?.id)
      : productData

    if (!Array.isArray(filteredData)) return null

    return filteredData.map(item => (
      <Table.Tr key={item.id}>
        <Table.Td>{item.id}</Table.Td>
        <Table.Td>
          <a
            className="underline"
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
        <Table.Td className={styles.statusRow}>{getLocalizedStatus(item.status)}</Table.Td>
        <Table.Td>
          {item.cartItems[0].product ? (
            <a className="underline" href={`/product/${item.cartItems[0].product?.id}`}>
              смотреть
            </a>
          ) : (
            'нет продукта'
          )}
        </Table.Td>

        <Table.Td>{getLocalizedPurchase(item.type)}</Table.Td>
        <Table.Td>{item.deliveryAdress}</Table.Td>
        <Table.Td>
          {format(new Date(item.createdAt), 'dd MMMM, yyyy', {
            locale: ru,
          })}
        </Table.Td>
        <Table.Td>{new Intl.NumberFormat('en-KZ').format(item.amountPrice)}₸</Table.Td>
        <Table.Td className="flex gap-4">
          <button
            className={styles.statusNotBt}
            onClick={() => handleStatusChange(item.id, 'cancelled')}
          >
            <img src="/images/diskLike_photo.svg" alt="" />
          </button>
          <button
            className={styles.statusYesBtn}
            onClick={() => handleStatusChange(item.id, 'pending')}
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
              <Table.Th>ID</Table.Th>
              <Table.Th>Номер объявления</Table.Th>
              <Table.Th>Покупатель</Table.Th>
              <Table.Th>Статус</Table.Th>
              <Table.Th>Продукт</Table.Th>
              <Table.Th>Оплата</Table.Th>
              <Table.Th>Доставка</Table.Th>
              <Table.Th>Дата</Table.Th>
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
