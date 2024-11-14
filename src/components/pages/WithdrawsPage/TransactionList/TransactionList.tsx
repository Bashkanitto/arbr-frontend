import React from 'react'
import styles from './TransactionList.module.scss'

const transactions = [
	{ id: 1, name: 'Номер 415274', amount: 80000, date: '6 июня' },
	{ id: 2, name: 'Номер 415274', amount: -120000, date: '6 июня' },
	{ id: 3, name: 'Номер 415274', amount: 120000, date: '6 июня' },
	{ id: 4, name: 'Номер 415274', amount: 80000, date: '6 июня' },
	{ id: 5, name: 'Номер 415274', amount: 80000, date: '6 июня' },
]

const TransactionList: React.FC = () => {
	return (
		<div className={styles.container}>
			<h2 className={styles.title}> Операции</h2>
			<h3 className={styles.date}>{transactions[0].date}</h3>
			{transactions.map(transaction => (
				<div key={transaction.id} className={styles.transaction}>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<div className={styles.avatar}></div>
						<div>
							<div className={styles.details}>{transaction.name}</div>
							<div className={styles.subtitle}>Контрагент</div>
						</div>
					</div>
					<div
						className={`${styles.amount} ${
							transaction.amount > 0
								? styles.amountPositive
								: styles.amountNegative
						}`}
					>
						{transaction.amount > 0
							? `+ ${transaction.amount} ₸`
							: `- ${Math.abs(transaction.amount)} ₸`}
					</div>
				</div>
			))}
		</div>
	)
}

export default TransactionList
