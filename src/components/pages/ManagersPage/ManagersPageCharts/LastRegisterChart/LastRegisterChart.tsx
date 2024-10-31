import { format } from 'date-fns'
import { Avatar } from '../../../../atoms/Avatar'
import { DateItem } from '../../../../atoms/DateItem'
import { Table } from '../../../../atoms/Table'
import styles from './LastRegisterChart.module.scss'

const elements = [
	{
		fullName: 'Родриго Гоес',
		role: 'Менеджер',
		createdAt: new Date('2022-07-15T14:37:00'),
		profileLink: '#',
		avatar: 'https://via.placeholder.com/50',
	},
	{
		fullName: 'Виктор Галкин',
		role: 'Менеджер',
		createdAt: new Date('2022-07-15T14:37:00'),
		profileLink: '#',
		avatar: 'https://via.placeholder.com/50',
	},
	{
		fullName: 'Оскар Мальгасов',
		role: 'Менеджер',
		createdAt: new Date('2022-07-15T14:37:00'),
		profileLink: '#',
		avatar: 'https://via.placeholder.com/50',
	},
	{
		fullName: 'Чириштиано Роналдо',
		role: 'Менеджер',
		createdAt: new Date('2022-07-15T14:37:00'),
		profileLink: '#',
		avatar: 'https://via.placeholder.com/50',
	},
]

const LastRegisterChart = () => {
	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Последние регистрации</h2>
			<Table stickyHeader>
				<Table.Tbody>
					{elements.map((item, index) => (
						<Table.Tr key={index}>
							<Table.Td>
								<Avatar />
							</Table.Td>
							<Table.Td className={styles.nameRole}>
								<p>{item.fullName}</p>
								<p>{item.role}</p>
							</Table.Td>
							<Table.Td>
								<DateItem variantColor='secondary'>
									{format(item.createdAt, 'dd.MM.yy - HH:mm')}
								</DateItem>
							</Table.Td>
							<Table.Td>
								<a href={item.profileLink} className={styles.profileLink}>
									Смотреть профиль
								</a>
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</div>
	)
}

export default LastRegisterChart
