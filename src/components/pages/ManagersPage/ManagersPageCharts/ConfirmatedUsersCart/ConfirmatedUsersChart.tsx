import { Avatar } from '../../../../atoms/Avatar'
import { DateItem } from '../../../../atoms/DateItem'
import { Table } from '../../../../atoms/Table'
import styles from './ConfirmatedUsersChart.module.scss'

const elements = [
	{
		fullName: 'Родриго Гоес',
		role: 'Менеджер',
		status: 'Подтверждено',
		profileLink: '#',
		avatar: 'https://via.placeholder.com/50',
	},
	{
		fullName: 'Виктор Галкин',
		role: 'Менеджер',
		status: 'Подтверждено',
		profileLink: '#',
		avatar: 'https://via.placeholder.com/50',
	},
	{
		fullName: 'Оскар Мальгасов',
		role: 'Менеджер',
		status: 'Подтверждено',
		profileLink: '#',
		avatar: 'https://via.placeholder.com/50',
	},
	{
		fullName: 'Чириштиано Роналдо',
		role: 'Менеджер',
		status: 'Подтверждено',
		profileLink: '#',
		avatar: 'https://via.placeholder.com/50',
	},
]

const ConfirmatedUsersChart = () => {
	return (
		<div className={styles.container}>
			<h3 style={{ fontSize:'18px'}}>Юр. лица с подтверждениями</h3>
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
								<DateItem variantColor='success'>{item.status}</DateItem>
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

export default ConfirmatedUsersChart
