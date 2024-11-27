/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRightIcon } from '../../../assets/icons/ArrowUpRightIcon'
import { DiscountIcon } from '../../../assets/icons/DiscountIcon'
import authStore from '../../../store/AuthStore'
import { Avatar } from '../../atoms/Avatar'
import DiscountModal from '../../pages/CatalogPage/DiscountModal/DiscountModal'
import EditProcentModal from '../../pages/CatalogPage/EditProcentModal/EditProcentModal'
import styles from './Tender.module.scss'

// Fix user props in Tender
const Tender = ({ user }: { user: any }) => {
	const navigate = useNavigate()
	const [isProcentModalOpen, setIsProcentModalOpen] = useState(false)
	const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false)

	const { isAdmin } = authStore

	const uniqueBrands: string[] = useMemo(() => {
		return Array.from(
			new Set(user.vendorGroups.map((item: any) => item.product.brand.name))
		)
	}, [user.vendorGroups])

	return (
		<div className={styles['tender']}>
			{/* Информация о пользователе */}
			<div className={styles['tender-user']}>
				<div className={styles['tender-user-info']}>
					<Avatar />
					<div>
						<p className={styles['tender-user-name']}>{user.firstName}</p>
						<p className={styles['tender-user-role']}>Поставщик</p>
					</div>
					{isAdmin && (
						<>
							<button
								onClick={() => setIsProcentModalOpen(true)}
								className={styles['link']}
							>
								<ArrowUpRightIcon />
							</button>
							<button
								onClick={() => setIsDiscountModalOpen(true)}
								className={styles['link']}
								style={{ background: 'black' }}
							>
								<DiscountIcon />
							</button>
						</>
					)}
				</div>
				<div className={styles['tender-user-statistics']}>
					<div className={styles['tender-winned']}>
						<p>
							Рейтинг: <span>{user.rating}</span>
						</p>
						<p>
							Количество товаров: <span>{user.vendorGroups.length}</span>
						</p>
						<div className={styles.brandWrapper}>
							{uniqueBrands.map((brandName, index) => (
								<span key={index} className={styles.brand}>
									{brandName}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Отображение тендеров */}
			<div className={styles['tender-items']}>
				{user.vendorGroups.map(
					(item: {
						id: number | string
						product: {
							images: { url: any }[]
							name: string
						}
					}) => (
						<button
							onClick={() => navigate(`/product/${item.id}`)}
							key={item.id}
							className={styles['tender-item']}
						>
							<img
								src={item.product.images[0].url || 'placeholder.png'}
								className={styles['tender-image']}
							/>
							<p className={styles['tender-title']}>{item.product.name}</p>
						</button>
					)
				)}
			</div>

			{/* percentModal */}
			{isProcentModalOpen && (
				<EditProcentModal
					user={user}
					isOpen={isProcentModalOpen}
					onClose={() => setIsProcentModalOpen(false)}
				/>
			)}

			{/* discountModal */}
			{isDiscountModalOpen && (
				<DiscountModal
					isOpen={isDiscountModalOpen}
					onClose={() => setIsDiscountModalOpen(false)}
				/>
			)}
		</div>
	)
}

export default Tender
