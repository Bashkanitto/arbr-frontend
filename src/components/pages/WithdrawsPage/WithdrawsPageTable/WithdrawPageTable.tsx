import { Checkbox, Select } from '@mantine/core'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DeleteIcon, EditIcon, EyeIcon } from '../../../../assets/icons'
import { BaseButton } from '../../../atoms/Button/BaseButton'
import { DateItem } from '../../../atoms/DateItem'
import { Table } from '../../../atoms/Table'
import { ModalWindow } from '../../../molecules'
import styles from './WithdrawsPageTable.module.scss'

const initialElements = [
	{
		id: 12304,
		customer: 'Иман Ног',
		status: 'Выиграно',
		sum: '190 000',
		date: new Date(),
	},
	{
		id: 123204,
		customer: 'Иман Ног',
		status: 'Отказано',
		sum: '190 000',
		date: new Date(),
	},
	{
		id: 1214,
		customer: 'Самса Бургер',
		status: 'В ожиданий',
		sum: '1 920 000',
		date: new Date(),
	},
]

export const WithdrawsPageTable = () => {
	const [selectRows, setSelectRows] = useState<number[]>([])
	const [elementsData, setElementsData] = useState(initialElements)
	const [selectedItem, setSelectedItem] = useState(null)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [statusFilter, setStatusFilter] = useState<string | null>(null)
	const navigate = useNavigate()

	const handSelectAllChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { checked } = event.target
		if (checked) {
			setSelectRows(elementsData.map((_, index) => index))
		} else {
			setSelectRows([])
		}
	}

	const navigateToDetails = (id: number) => {
		navigate(`/details/${id}`)
	}

	const openEditModal = (item: (typeof elementsData)[0]) => {
		setSelectedItem(item)
		setIsEditModalOpen(true)
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Выиграно':
				return 'success'
			case 'В ожиданий':
				return 'warning'
			case 'Отказано':
				return 'danger'
			default:
				return 'gray'
		}
	}

	const handleSelectRowChange =
		(index: number) => (event: ChangeEvent<HTMLInputElement>) => {
			const { checked } = event.target
			if (checked) {
				setSelectRows([...selectRows, index])
			} else {
				setSelectRows(selectRows.filter(item => item !== index))
			}
		}

	const handleDelete = (id: number) => {
		const confirmed = window.confirm(
			'Вы уверены что хотите удалить этот объект?'
		)
		if (confirmed) {
			setElementsData(elementsData.filter(item => item.id !== id))
		}
	}

	const handleEditSave = (updatedItem: (typeof elementsData)[0]) => {
		setElementsData(
			elementsData.map(item =>
				item.id === updatedItem.id ? updatedItem : item
			)
		)
	}

	const renderRow = () => {
		const filteredData = statusFilter
			? elementsData.filter(item => item.status === statusFilter)
			: elementsData

		return filteredData.map((item, index) => (
			<Table.Tr key={index}>
				<Table.Td>
					<Checkbox
						size='xs'
						checked={selectRows.includes(index)}
						onChange={handleSelectRowChange(index)}
					/>
				</Table.Td>
				<Table.Td>{item.id}</Table.Td>
				<Table.Td>{item.customer}</Table.Td>
				<Table.Td>
					<DateItem variantColor={getStatusColor(item.status)}>
						{item.status}
					</DateItem>
				</Table.Td>
				<Table.Td>{`${item.sum}₸`}</Table.Td>
				<Table.Td>
					{format(item.date, 'dd MMMM, yyyy', { locale: ru })}
				</Table.Td>
				<Table.Td style={{ width: '50px', padding: '0' }}>
					<button onClick={() => navigateToDetails(item.id)}>
						<EyeIcon />
					</button>
					<button onClick={() => openEditModal(item)}>
						<EditIcon />
					</button>
					<button onClick={() => handleDelete(item.id)}>
						<DeleteIcon />
					</button>
				</Table.Td>
			</Table.Tr>
		))
	}

	return (
		<>
			<div className={styles['withdraws-page-table-head']}>
				<div>
					<input type='text' placeholder='Поиск' />
					<Select
						placeholder='Выберите регион'
						data={[
							{ value: 'all', label: 'Все' },
							{ value: 'kz', label: 'Казахстан' },
							{ value: 'ru', label: 'Россия' },
						]}
					/>
					<Select
						placeholder='Статус'
						data={[
							{ value: '', label: 'Все' },
							{ value: 'Выиграно', label: 'Выиграно' },
							{ value: 'В ожиданий', label: 'В ожиданий' },
							{ value: 'Отказано', label: 'Отказано' },
						]}
						onChange={value => setStatusFilter(value)}
						value={statusFilter || ''}
					/>
				</div>
				<BaseButton>Экспорт</BaseButton>
			</div>
			<div className={styles['withdraws-page-table']}>
				<Table stickyHeader>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>
								<Checkbox
									size='xs'
									checked={selectRows.length === elementsData.length}
									indeterminate={
										selectRows.length > 0 &&
										selectRows.length < elementsData.length
									}
									onChange={handSelectAllChange}
								/>
							</Table.Th>
							<Table.Th>ID заказа</Table.Th>
							<Table.Th>Покупатель</Table.Th>
							<Table.Th>Статус</Table.Th>
							<Table.Th>Сумма</Table.Th>
							<Table.Th>Дата</Table.Th>
							<Table.Th style={{ width: '150px', padding: '0' }}>
								Действие
							</Table.Th>
						</Table.Tr>
					</Table.Thead>
					{renderRow()}
				</Table>
			</div>
			{isEditModalOpen && selectedItem && (
				<ModalWindow
					isOpen={isEditModalOpen}
					onClose={() => setIsEditModalOpen(false)}
					item={selectedItem}
					onSave={handleEditSave}
				/>
			)}
		</>
	)
}
