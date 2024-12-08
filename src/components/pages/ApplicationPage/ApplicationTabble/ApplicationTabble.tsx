import { Select, Skeleton } from '@mantine/core'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { fetchAllProducts } from '../../../../services/api/productService'
import { Table } from '../../../atoms/Table'
import { Pagination } from '../../../molecules/Pagination/Pagination'
import styles from './ApplicationTabble.module.scss'

interface ProductType {
	id: number
	amountPrice: number
	price: number
	name: string
	role: string
	customer: string
	quantity: string
	status: 'active' | 'pending' | 'inactive'
	rating: string
	deletedAt: string
	description: string
	updatedAt: string
	createdAt: string
}

export const ApplicationTable = () => {
	const [productData, setProductData] = useState<ProductType[]>([])
	const [statusFilter, setStatusFilter] = useState<string | null>('')
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)
	const [page, setPage] = useState<number>(1)
	const [pageSize] = useState<number>(10)
	const [totalPages, setTotalPages] = useState<number>(1)

	useEffect(() => {
		const loadProducts = async () => {
			setLoading(true)
			setError(null)
			try {
				const { records, meta }: any = await fetchAllProducts()
				setProductData(records)
				setTotalPages(meta.totalPages)
			} catch (err) {
				setError('Failed to load accounts')
				console.error(err)
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
			case 'inactive':
				return 'danger'
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

	// тело таблицы
	const renderRow = () => {
		const filteredData = statusFilter
			? productData.filter(item => item.status === statusFilter)
			: productData

		return filteredData.map(item => (
			<Table.Tr key={item.id}>
				<Table.Td>{item.id}</Table.Td>
				<Table.Td>{item.name}</Table.Td>
				<Table.Td>
					{format(item.updatedAt, 'dd MMMM, yyyy', { locale: ru })}
				</Table.Td>
				<Table.Td className={styles.statusRow} style={{ textAlign: 'end' }}>
					<p
						className={`${styles.status} ${getStatusColor(
							item.status
						)} ${getStatusColor(item.status)}bg`}
					>
						{getLocalizedStatus(item.status)}
					</p>
				</Table.Td>
			</Table.Tr>
		))
	}

	// head таблицы
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

			<Pagination
				page={page}
				totalPages={totalPages}
				onPageChange={newPage => setPage(newPage)}
			/>
		</>
	)
}
