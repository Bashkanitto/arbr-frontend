/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select, Skeleton } from '@mantine/core'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { fetchMyProducts, patchStatus } from '@services/api/productService'
import authStore from '@store/AuthStore'
import { Table } from '@components/atoms/Table'
import styles from './ApplicationTabble.module.scss'
import NotificationStore from '@store/NotificationStore'
import Status from '../../../helpers/status'

export const ApplicationTable = () => {
  const [productData, setProductData] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState<string | null>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { userProfile }: any = authStore
  const vendorId = userProfile.id

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const response: any = await fetchMyProducts(vendorId)
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
  }, [])

  const handleStatusChange = async (productId: number, newStatus: 'inactive') => {
    try {
      // Обновляем статус в локальном состоянии
      const updatedData = productData.map(item =>
        item.product.id === productId
          ? { ...item, product: { ...item.product, status: newStatus } }
          : item
      )
      setProductData(updatedData)
      await patchStatus(productId, newStatus)

      NotificationStore.addNotification(
        'Заявка',
        `Заявка продукта под номером ${productId} успешно изменена`,
        'success'
      )
    } catch (error: any) {
      console.log(error)
      const revertedData = productData.map(item =>
        item.product.id === productId
          ? { ...item, product: { ...item.product, status: 'active' } } // Assuming "active" is the previous status
          : item
      )
      setProductData(revertedData)

      NotificationStore.addNotification(
        'Заявка',
        `Произошла ошибка при попытке измененить заявку`,
        'error'
      )
    }
  }

  if (loading) return <Skeleton />
  if (error) return <div>Ошибка: {error}</div>

  const renderRow = () => {
    const filteredData = statusFilter
      ? productData.filter(item => item.product.status === statusFilter)
      : productData

    if (!Array.isArray(filteredData)) return null

    return filteredData.map(item => (
      <Table.Tr key={item.id}>
        <Table.Td>{item.id}</Table.Td>
        <Table.Td>{item.product.name}</Table.Td>
        <Table.Td>
          {format(new Date(item.product.createdAt), 'dd MMMM, yyyy', {
            locale: ru,
          })}
        </Table.Td>
        <Table.Td>
          <Status>{item.product.status}</Status>
        </Table.Td>
        <Table.Td>
          <button
            style={{ float: 'right' }}
            className={styles.statusNotBtn}
            onClick={() => handleStatusChange(item.product.id, 'inactive')}
          >
            <img src="/images/diskLike_photo.svg" alt="" />
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
            data={[
              { value: '', label: 'Все' },
              { value: 'active', label: 'Разрешено' },
              { value: 'pending', label: 'В ожидании' },
              { value: 'inactive', label: 'Отклонено' },
            ]}
            onChange={value => setStatusFilter(value)}
          />
        </div>
      </div>
      <div className={styles['security-page-table']}>
        <Table stickyHeader>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Продукт</Table.Th>
              <Table.Th>Дата</Table.Th>
              <Table.Th>Статус</Table.Th>
              <Table.Th style={{ textAlign: 'end' }}>Действие</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{renderRow()}</Table.Tbody>
        </Table>
      </div>
    </>
  )
}
