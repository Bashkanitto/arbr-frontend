import { Checkbox, Select } from '@mantine/core'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ChangeEvent, useState } from 'react'
import { BaseButton } from '../../../atoms/Button/BaseButton'
import { DateItem } from '../../../atoms/DateItem'
import { Table } from '../../../atoms/Table'
import styles from './SecurityPageTable.module.scss'

const initialElements = [
	{
		id: 12304,
		customer: 'Иман Ног',
		status: 'Создано',
		lastUpdate: new Date(),
	},
	{
		id: 123204,
		customer: 'Иман Ног',
		status: 'Подтверждено',
		lastUpdate: new Date(),
	},
	{
		id: 1214,
		customer: 'Самса Бургер',
		status: 'Создано',
		lastUpdate: new Date(),
	},
]

export const SecurityPageTable = () => {
	const [selectRows, setSelectRows] = useState<number[]>([])
	const [elementsData] = useState(initialElements)
	const [statusFilter, setStatusFilter] = useState<string | null>(null)

	const handSelectAllChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { checked } = event.target
		if (checked) {
			setSelectRows(elementsData.map((_, index) => index))
		} else {
			setSelectRows([])
		}
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Создано':
				return 'secondary'
			case 'Подтверждено':
				return 'success'
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

	const renderRow = () => {
		const filteredData = statusFilter
			? elementsData.filter(item => item.status === statusFilter)
			: elementsData

		return filteredData.map((item, index) => (
			<Table.Tr key={index}>
				<Table.Td style={{ width: '16px' }}>
					<Checkbox
						size='xs'
						checked={selectRows.includes(index)}
						onChange={handleSelectRowChange(index)}
					/>
				</Table.Td>
				<Table.Td>{item.customer}</Table.Td>
				<Table.Td>
					<DateItem variantColor={getStatusColor(item.status)}>
						{item.status}
					</DateItem>
				</Table.Td>
				<Table.Td>
					{format(item.lastUpdate, 'dd MMMM, yyyy', { locale: ru })}
				</Table.Td>
				<Table.Td style={{ width: '50px', padding: '0' }}>
					<a
						style={{
							color: item.status == 'Подтверждено' ? '#23B96C' : 'secondary',
						}}
						href={`/profile/${item.id}`}
					>
						Смотреть профиль
					</a>
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
							{ value: 'Создано', label: 'Создано' },
							{ value: 'Подтверждено', label: 'Подтверждено' },
						]}
						onChange={value => setStatusFilter(value)}
						value={statusFilter || ''}
					/>
				</div>
				<BaseButton>Экспорт</BaseButton>
			</div>
			<div className={styles['security-page-table']}>
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
							<Table.Th>Пользователь</Table.Th>
							<Table.Th>Статус</Table.Th>
							<Table.Th>Последнее обновление</Table.Th>
							<Table.Th style={{ width: '150px', padding: '0' }}>
								Действие
							</Table.Th>
						</Table.Tr>
					</Table.Thead>
					{renderRow()}
				</Table>
			</div>
		</>
	)
}
