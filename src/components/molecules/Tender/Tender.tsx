import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRightIcon } from '../../../assets/icons/ArrowUpRightIcon'
import { Avatar } from '../../atoms/Avatar'
import EditProcentModal from '../../pages/CatalogPage/EditProcentModal/EditProcentModal'
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
	const navigate = useNavigate()
	const [isProcentModalOpen, setIsProcentModalOpen] = useState(false)

	function navigateToProductDetails(id: number) {
		navigate(`/product/${id}`)
	}

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
					<button
						onClick={() => setIsProcentModalOpen(true)}
						className={styles['link']}
					>
						<ArrowUpRightIcon />
					</button>
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
					<button
						onClick={() => navigateToProductDetails(tender.id)}
						key={tender.id}
						className={styles['tender-item']}
					>
						<div className={styles['tender-image']} />
						{/* <img src={tender.image} className={styles['tender-image']} /> */}
						<p className={styles['tender-title']}>{tender.title}</p>
					</button>
				))}
			</div>
			{isProcentModalOpen && (
				<EditProcentModal
					isOpen={isProcentModalOpen}
					onClose={() => setIsProcentModalOpen(false)}
				/>
			)}
		</div>
	)
}

export default Tender
