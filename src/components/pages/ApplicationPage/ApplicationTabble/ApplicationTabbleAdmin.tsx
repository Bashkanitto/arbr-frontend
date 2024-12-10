import { Checkbox, Select, Skeleton } from '@mantine/core'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ChangeEvent, useEffect, useState } from 'react'
import {
	fetchAllVendors,
	patchStatus,
} from '../../../../services/api/productService'
import { VendorGroups, VendorType } from '../../../../services/api/Types'
import { Table } from '../../../atoms/Table'
import { Pagination } from '../../../molecules/Pagination/Pagination'
import styles from './ApplicationTabble.module.scss'

export const ApplicationTableAdmin = () => {
	const [selectRows, setSelectRows] = useState<number[]>([])
	const [productData, setProductData] = useState<VendorType[]>([])
	const [statusFilter, setStatusFilter] = useState<string | null>('')
	const [loading, setLoading] = useState<boolean>(false)
	const [searchQuery, setSearchQuery] = useState<string>('')
	const [error, setError] = useState<string | null>(null)
	const [page, setPage] = useState<number>(1)
	const [pageSize] = useState<number>(10)
	const [totalPages, setTotalPages] = useState<number>(1)

	useEffect(() => {
		// загрузка продуктов
		const loadVendors = async () => {
			setLoading(true)
			setError(null)
			try {
				const { records, meta } = await fetchAllVendors(page, pageSize)
				setProductData(records)
				setTotalPages(meta?.totalPages || Math.ceil(records.length / pageSize))
			} catch (err) {
				setError('Не удалось загрузить данные аккаунтов')
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		loadVendors()
	}, [page, pageSize])

	const handleStatusChange = async (
		productId: number,
		newStatus: 'active' | 'inactive'
	) => {
		try {
			setLoading(true)
			await patchStatus(productId, newStatus)
		} catch (error) {
			setError('Не удалось изменить статус продукта')
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	const allVendorGroups: VendorGroups[] = productData.flatMap(
		vendor => vendor.vendorGroups
	)

	if (loading) return <Skeleton />
	if (error) return <div>Ошибка: {error}</div>

	// Логика выделения всех строк
	const handleSelectAllChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { checked } = event.target
		if (checked) {
			setSelectRows(allVendorGroups.map(item => item.id))
		} else {
			setSelectRows([])
		}
	}

	const filteredData = allVendorGroups.filter(group => {
		const vendor = productData.find(vendor => vendor.id === group.id)
		const vendorName = vendor?.firstName || 'Неизвестно'
		const productName = group.product?.name || ''
		return (
			productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			vendorName.toLowerCase().includes(searchQuery.toLowerCase())
		)
	})

	const handleSelectRowChange =
		(id: number) => (event: ChangeEvent<HTMLInputElement>) => {
			const { checked } = event.target
			if (checked) {
				setSelectRows([...selectRows, id])
			} else {
				setSelectRows(selectRows.filter(item => item !== id))
			}
		}

	const renderRow = () => {
		const filteredByStatus = statusFilter
			? filteredData.filter(group => group.product.status === statusFilter)
			: filteredData

		return filteredByStatus.map(group => {
			const vendor = productData.find(vendor => vendor.id === group.id)
			const vendorName = vendor?.firstName || 'Неизвестно'

			return (
				<Table.Tr key={group.id}>
					<Table.Td style={{ width: '16px' }}>
						<Checkbox
							size='xs'
							checked={selectRows.includes(group.id)}
							onChange={handleSelectRowChange(group.id)}
						/>
					</Table.Td>
					<Table.Td>{group.id}</Table.Td>
					<Table.Td>{group.product?.name}</Table.Td>
					<Table.Td>{vendorName}</Table.Td>
					<Table.Td>
						{group.product?.createdAt
							? format(new Date(group.product.createdAt), 'dd MMMM, yyyy', {
									locale: ru,
							  })
							: '—'}
					</Table.Td>
					<Table.Td style={{ width: '50px', padding: '0' }}>
						<a href={`/profile/${group.id}`}>Посмотреть документы</a>
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
							className={styles.statusNotBtn}
							onClick={() => handleStatusChange(group.id, 'inactive')}
						>
							<img src='/images/diskLike_photo.svg' alt='' />
						</button>
						<button
							className={styles.statusYesBtn}
							onClick={() => handleStatusChange(group.id, 'active')}
						>
							<img src='/images/like_photo.svg' alt='' />
						</button>
					</Table.Td>
				</Table.Tr>
			)
		})
	}

	// head таблицы
	return (
		<>
			<div className={styles['security-page-table-head']}>
				<div>
					<input
						type='text'
						placeholder='Поиск'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
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
							<Table.Th>
								<Checkbox
									size='xs'
									checked={selectRows.length === allVendorGroups.length}
									indeterminate={
										selectRows.length > 0 &&
										selectRows.length < allVendorGroups.length
									}
									onChange={handleSelectAllChange}
								/>
							</Table.Th>
							<Table.Th>ID заказа</Table.Th>
							<Table.Th>Продукт</Table.Th>
							<Table.Th>Продавец</Table.Th>
							<Table.Th>Дата</Table.Th>
							<Table.Th>Просмотр документов</Table.Th>
							<Table.Th style={{ textAlign: 'end' }}>Действие</Table.Th>
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
