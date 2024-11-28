import React, { useEffect, useState } from 'react'
import { fetchOperations } from '../../../../services/api/OperationsServices'
import styles from './TransactionList.module.scss'

// Define the type for an operation
interface Operation {
	id: number
	name: string
	amount: number
}

const TransactionList: React.FC = () => {
	const [operations, setOperations] = useState<Operation[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	useEffect(() => {
		const getBalance = async () => {
			try {
				const response: any = await fetchOperations()
				setOperations(response.records)
			} catch (err) {
				console.error(err)
				setError('Не удалось загрузить операции.')
			} finally {
				setLoading(false)
			}
		}

		getBalance()
	}, [])

	if (loading) {
		return <div className={styles.container}>Загрузка...</div>
	}

	if (error) {
		return <div className={styles.container}>{error}</div>
	}

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Операции</h2>
			{operations.length === 0 ? (
				<p className={styles.noTransactions}>Нет операций для отображения.</p>
			) : (
				operations.map(item => (
					<div key={item.id} className={styles.transaction}>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<div className={styles.avatar}></div>
							<div>
								<div className={styles.details}>Номер {item.id}</div>
								<div className={styles.subtitle}>Контрагент</div>
							</div>
						</div>
						<div
							className={`${styles.amount} ${
								item.amount > 0 ? styles.amountPositive : styles.amountNegative
							}`}
						>
							{item.amount > 0
								? `+ ${item.amount} ₸`
								: `- ${Math.abs(item.amount)} ₸`}
						</div>
					</div>
				))
			)}
		</div>
	)
}

export default TransactionList
