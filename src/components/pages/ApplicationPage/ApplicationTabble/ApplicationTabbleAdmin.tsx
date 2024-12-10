import { Checkbox, Select, Skeleton } from '@mantine/core'
import { format } from 'date-fns'
import { enUS, ru } from 'date-fns/locale'
import { jsPDF } from 'jspdf' // Импортируем jsPDF
import { ChangeEvent, useEffect, useState } from 'react'
import {
	fetchVendorGroups,
	patchStatus,
} from '../../../../services/api/productService'
import { VendorGroups } from '../../../../services/api/Types'
import { Table } from '../../../atoms/Table'
import { Pagination } from '../../../molecules/Pagination/Pagination'
import styles from './ApplicationTabble.module.scss'

export const ApplicationTableAdmin = () => {
	const [selectRows, setSelectRows] = useState<number[]>([])
	const [productData, setProductData] = useState<any[]>([])
	const [statusFilter, setStatusFilter] = useState<string | null>('')
	const [loading, setLoading] = useState<boolean>(false)
	const [searchQuery, setSearchQuery] = useState<string>('')
	const [error, setError] = useState<string | null>(null)
	const [page, setPage] = useState<number>(1)
	const [pageSize] = useState<number>(10)
	const [totalPages, setTotalPages] = useState<number>(1)

	useEffect(() => {
		// загрузка данных
		const loadVendors = async () => {
			setLoading(true)
			setError(null)
			try {
				const { records, meta } = await fetchVendorGroups(page, pageSize)
				setProductData(records)
				setTotalPages(meta?.totalPages || Math.ceil(records.length / pageSize))
			} catch (err) {
				setError('Не удалось загрузить данные')
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
			// Обновляем статус в локальном состоянии
			setProductData(prevData =>
				prevData.map(item =>
					item.id === productId
						? { ...item, product: { ...item.product, status: newStatus } }
						: item
				)
			)
		} catch (error) {
			setError('Не удалось изменить статус продукта')
			console.error(error)
		} finally {
			setLoading(false)
		}
	}
	// Список всех групп поставщиков
	const allVendorGroups: VendorGroups[] = productData.flatMap(
		vendor => vendor.vendorGroups
	)

	if (loading) return <Skeleton />
	if (error) return <div>Ошибка: {error}</div>

	// Логика фильтрации данных по запросу поиска
	const filteredData = productData.filter(item => {
		const productName = item.product?.name.toLowerCase() || ''
		return productName.includes(searchQuery.toLowerCase())
	})

	// Логика фильтрации по статусу
	const filteredByStatus = statusFilter
		? filteredData.filter(group => group.product.status === statusFilter)
		: filteredData

	// Логика выделения всех строк
	const handleSelectAllChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { checked } = event.target
		if (checked) {
			setSelectRows(allVendorGroups.map(item => item.id))
		} else {
			setSelectRows([])
		}
	}

	// Логика выбора строки
	const handleSelectRowChange =
		(id: number) => (event: ChangeEvent<HTMLInputElement>) => {
			const { checked } = event.target
			if (checked) {
				setSelectRows([...selectRows, id])
			} else {
				setSelectRows(selectRows.filter(item => item !== id))
			}
		}

	// Функция для создания и скачивания PDF
	const downloadPDF = (product: any) => {
		const doc = new jsPDF()

		// Добавляем информацию о продукте в PDF
		doc.text(`Product: ${product.product?.name}`, 10, 10)
		doc.text(`ID: ${product.id}`, 10, 20)
		doc.text(`Vendor: ${product.vendor.firstName}`, 10, 30)
		doc.text(`Price: ${product.product?.price}`, 10, 40)
		doc.text(`Description: ${product.product?.desription}`, 10, 50)
		doc.text(
			`Date: ${format(new Date(product.product?.createdAt), 'dd MMMM, yyyy', {
				locale: enUS,
			})}`,
			10,
			60
		)
		doc.text(`Quantity: ${product.product?.quantity}`, 10, 70)
		doc.text(`Status: ${product.product?.status}`, 10, 80)

		// Добавить другие данные, если необходимо

		// Генерируем и скачиваем PDF
		doc.save(`product_${product.id}.pdf`)
	}

	const renderRow = () => {
		return filteredByStatus.map(item => {
			return (
				<Table.Tr key={item.id}>
					<Table.Td style={{ width: '16px' }}>
						<Checkbox
							size='xs'
							checked={selectRows.includes(item.id)}
							onChange={handleSelectRowChange(item.id)}
						/>
					</Table.Td>
					<Table.Td>{item.id}</Table.Td>
					<Table.Td>{item.product?.name}</Table.Td>
					<Table.Td>{item.vendor.firstName}</Table.Td>
					<Table.Td>
						{item.product?.createdAt
							? format(new Date(item.product.createdAt), 'dd MMMM, yyyy', {
									locale: ru,
							  })
							: '—'}
					</Table.Td>
					<Table.Td style={{ width: '50px', padding: '0' }}>
						<a href='#' onClick={() => downloadPDF(item)}>
							Посмотреть документы
						</a>
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
							onClick={() => handleStatusChange(item.id, 'inactive')}
						>
							<img src='/images/diskLike_photo.svg' alt='' />
						</button>
						<button
							className={styles.statusYesBtn}
							onClick={() => handleStatusChange(item.id, 'active')}
						>
							<img src='/images/like_photo.svg' alt='' />
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
