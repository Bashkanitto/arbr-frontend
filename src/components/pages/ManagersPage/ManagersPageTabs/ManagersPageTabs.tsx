import { format } from 'date-fns'
import jsPDF from 'jspdf'
import { useEffect, useState } from 'react'
import {
	AccountType,
	fetchAccounts,
} from '../../../../services/api/AccountsService'
import { BaseButton } from '../../../atoms/Button/BaseButton'
import { Select } from '../../../atoms/Select'
import { Tabs } from '../../../atoms/Tabs'
import styles from './ManagersPageTabs.module.scss'

export const ManagersPageTabs = () => {
	const [lastConfirmedAccounts, setLastConfirmedAccounts] = useState<
		AccountType[]
	>([])

	useEffect(() => {
		const loadLastConfirmedAccounts = async () => {
			try {
				const response = await fetchAccounts()
				// Only set the records array to state
				setLastConfirmedAccounts(response.records)
			} catch (err: unknown) {
				console.error(err)
			}
		}

		loadLastConfirmedAccounts()
	}, [])

	const handleExport = () => {
		// Ensure lastConfirmedAccounts is an array before calling forEach
		if (Array.isArray(lastConfirmedAccounts)) {
			// Create a new instance of jsPDF
			const doc = new jsPDF()
			// Example table or data
			doc.setFontSize(12)
			lastConfirmedAccounts.forEach((item, index) => {
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
		} else {
			console.error(
				'lastConfirmedAccounts is not an array:',
				lastConfirmedAccounts
			)
		}
	}

	return (
		<div className={styles['managers-page-tabs']}>
			<Tabs className={styles['tab']} defaultValue='all'>
				<Tabs.List>
					<Tabs.Tab value='all'>Все карты</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel className={styles['panel']} value='all'>
					<Select
						placeholder='Типы менеджеров'
						data={[
							{ value: 'all', label: 'Все' },
							{ value: 'active', label: 'Активные' },
							{ value: 'inactive', label: 'Неактивные' },
						]}
					/>
					<Select
						placeholder='Статус'
						data={[
							{ value: 'all', label: 'Все' },
							{ value: 'active', label: 'Активные' },
							{ value: 'inactive', label: 'Неактивные' },
						]}
					/>
					<BaseButton onClick={handleExport}>Экспорт</BaseButton>
				</Tabs.Panel>
				<Tabs.Panel value='groups'>
					<></>
				</Tabs.Panel>
			</Tabs>
		</div>
	)
}
