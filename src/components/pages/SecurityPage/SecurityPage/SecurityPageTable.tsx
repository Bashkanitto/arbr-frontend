/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, Select } from '@mantine/core'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import jsPDF from 'jspdf'
import { ChangeEvent, useEffect, useState } from 'react'
import { fetchAccounts } from '../../../../services/api/AccountsService'
import { BaseButton } from '../../../atoms/Button/BaseButton'
import { DateItem } from '../../../atoms/DateItem'
import { Table } from '../../../atoms/Table'
import styles from './SecurityPageTable.module.scss'

// Тип данных пользователя
interface User {
	firstName: string
	id: number
	role: string
	customer: string
	status: 'Создано' | 'Подтверждено'
	updatedAt: string
	createdAt: string
}

export const SecurityPageTable = () => {
	const [selectRows, setSelectRows] = useState<number[]>([])
	const [userData, setUserData] = useState<User[]>([])
	const [statusFilter, setStatusFilter] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadLastConfirmedAccounts = async () => {
			setLoading(true)
			setError(null)
			try {
				const accounts: any = await fetchAccounts()
				setUserData(accounts)
			} catch (err) {
				setError('Failed to load last confirmed accounts')
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		loadLastConfirmedAccounts()
	}, [])
	if (loading) return <div>Loading...</div>
	if (error) return <div>Error: {error}</div>

	const handleExport = () => {
		// Create a new instance of jsPDF
		const doc = new jsPDF()
		// Example table or data
		doc.setFontSize(12)
		userData.forEach((item, index) => {
			doc.text(
				`${index + 1}. ${item.firstName} - ${item.role} - ${format(
					new Date(item.createdAt),
					'dd.MM.yy - HH:mm'
				)}`,
				10,
				50 + index * 10
			)
		})

		// Save the file
		doc.save('managers_report.pdf')
	}

	const handleSelectAllChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { checked } = event.target
		if (checked) {
			setSelectRows(userData.map(item => item.id))
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
			? userData.filter(item => item.status === statusFilter)
			: userData

		return filteredData.map(item => (
			<Table.Tr key={item.id}>
				<Table.Td style={{ width: '16px' }}>
					<Checkbox
						size='xs'
						checked={selectRows.includes(item.id)}
						onChange={handleSelectRowChange(item.id)}
					/>
				</Table.Td>
				<Table.Td>{item.firstName}</Table.Td>
				<Table.Td>
					<DateItem variantColor={getStatusColor(item.status)}>
						{item.status}
					</DateItem>
				</Table.Td>
				<Table.Td>
					{format(item.updatedAt, 'dd MMMM, yyyy', { locale: ru })}
				</Table.Td>
				<Table.Td style={{ width: '50px', padding: '0' }}>
					<a
						style={{
							color: item.status === 'Подтверждено' ? '#23B96C' : 'secondary',
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
				<BaseButton onClick={handleExport}>Экспорт</BaseButton>
			</div>
			<div className={styles['security-page-table']}>
				<Table stickyHeader>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>
								<Checkbox
									size='xs'
									checked={selectRows.length === userData.length}
									indeterminate={
										selectRows.length > 0 && selectRows.length < userData.length
									}
									onChange={handleSelectAllChange}
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
					<Table.Tbody>{renderRow()}</Table.Tbody>
				</Table>
			</div>
		</>
	)
}
