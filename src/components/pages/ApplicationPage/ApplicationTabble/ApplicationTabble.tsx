import { Select, Skeleton } from '@mantine/core'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { fetchMyProducts } from '../../../../services/api/productService'
import authStore from '../../../../store/AuthStore'
import { Table } from '../../../atoms/Table'
import styles from './ApplicationTabble.module.scss'

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
				setProductData(response)
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

	if (loading) return <Skeleton />
	if (error) return <div>Error: {error}</div>

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'success'
			case 'pending':
				return 'warning'
			case 'inactive':
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
			case 'inactive':
				return 'Отклонён'
			default:
				return 'Неизвестно'
		}
	}

	console.log(productData)
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
				<Table.Td className={styles.statusRow} style={{ textAlign: 'end' }}>
					<p
						className={`${styles.status} ${getStatusColor(
							item.product.status
						)} ${getStatusColor(item.product.status)}bg`}
					>
						{getLocalizedStatus(item.product.status)}
					</p>
				</Table.Td>
			</Table.Tr>
		))
	}

	return (
		<>
			<div className={styles['security-page-table-head']}>
				<div>
					<input type='text' placeholder='Поиск' />
					<Select
						placeholder='Статус'
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
							<Table.Th>ID заказа</Table.Th>
							<Table.Th>Продукт</Table.Th>
							<Table.Th>Дата</Table.Th>
							<Table.Th style={{ textAlign: 'end' }}>Статус</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>{renderRow()}</Table.Tbody>
				</Table>
			</div>
		</>
	)
}
