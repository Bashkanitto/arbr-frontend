import { Avatar } from '../../../atoms/Avatar'
import styles from './Tender.module.scss'

interface TenderItem {
	id: number
	image: string
	title: string
}

interface TenderType {
	id: number
	title: string
	name: string
	tenders: TenderItem[]
	winned: string
	sold: number
	rang: number
}

const Tender: React.FC<TenderType> = ({ name, tenders, winned, sold }) => {
	return (
		<div className={styles['tender']}>
			{/* Информация о пользователе */}
			<div className={styles['tender-user']}>
				<div className={styles['tender-user-info']}>
					<Avatar />
					<div>
						<p className={styles['tender-user-name']}>{name}</p>
						<p className={styles['tender-user-role']}>Поставщик</p>
					</div>
				</div>
				<div className={styles['tender-user-statistics']}>
					<div className={styles['tender-winned']}>
						<p>
							Выиграно всего лотов: <span>{winned}</span>
						</p>
						<p>
							Выиграно всего лотов: <span>{sold}</span>
						</p>
						<span>siemens.com</span>
					</div>
				</div>
			</div>

			{/* Отображение тендеров */}
			<div className={styles['tender-items']}>
				{tenders.map(tender => (
					<div key={tender.id} className={styles['tender-item']}>
						<img src={tender.image} className={styles['tender-image']} />
						<p className={styles['tender-title']}>{tender.title}</p>
					</div>
				))}
			</div>
		</div>
	)
}

export default Tender
