// components/LastRegisterChart/LastRegisterChart.tsx
import { Skeleton } from '@mantine/core'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import {
	AccountType,
	fetchAccounts,
} from '../../../../../services/api/AccountsService'
import { Avatar } from '../../../../atoms/Avatar'
import { DateItem } from '../../../../atoms/DateItem'
import { Table } from '../../../../atoms/Table'
import styles from './LastRegisterChart.module.scss'

const LastRegisterChart = () => {
	const [lastConfirmedAccounts, setLastConfirmedAccounts] = useState<
		AccountType[]
	>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	// Fetch the accounts data when the component mounts
	useEffect(() => {
		const loadLastConfirmedAccounts = async () => {
			setLoading(true)
			setError(null)
			try {
				const response = await fetchAccounts()
				setLastConfirmedAccounts(response.records)
			} catch (err: unknown) {
				setError('Failed to load last confirmed accounts')
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		loadLastConfirmedAccounts()
	}, [])

	if (error) return <div>Error: {error}</div>

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Последние регистрации</h2>

			<Table stickyHeader className={styles.tablee}>
				<Table.Tbody className={styles.tablee}>
					{lastConfirmedAccounts.map((item) =>
						loading ? (
							<Skeleton
								key={item.id}
								width={'100%'}
								height={100}
								radius={15}
								style={{ marginBottom: '10px' }}
							/>
						) : (
							<Table.Tr key={item.id}>
								<Table.Td>
									<Avatar />
								</Table.Td>
								<Table.Td className={styles.nameRole}>
									<p>{item.firstName || 'Неизвестный'}</p>
									<p>{item.role}</p>
								</Table.Td>
								<Table.Td>
									<DateItem variantColor='secondary'>
										{format(new Date(item.createdAt), 'dd.MM.yy - HH:mm')}
									</DateItem>
								</Table.Td>
								<Table.Td>
									<a href={`/vendor/${item.id}`} className={styles.profileLink}>
										Смотреть профиль
									</a>
								</Table.Td>
							</Table.Tr>
						)
					)}
				</Table.Tbody>
			</Table>
		</div>
	)
}

export default LastRegisterChart
