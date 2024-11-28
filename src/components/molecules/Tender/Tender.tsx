import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRightIcon } from '../../../assets/icons/ArrowUpRightIcon'
import { DiscountIcon } from '../../../assets/icons/DiscountIcon'
import authStore from '../../../store/AuthStore'
import { Avatar } from '../../atoms/Avatar'
import DiscountModal from '../../pages/CatalogPage/DiscountModal/DiscountModal'
import EditProcentModal from '../../pages/CatalogPage/EditProcentModal/EditProcentModal'
import styles from './Tender.module.scss'

const Tender = ({ user }: { user: any }) => {
	const navigate = useNavigate()
	const [isProcentModalOpen, setIsProcentModalOpen] = useState(false)
	const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false)
	const { isAdmin } = authStore

	// Filter unique brands
	const uniqueBrands: string[] = useMemo(() => {
		return Array.from(
			new Set(
				user.vendorGroups
					.map((item: any) => item.product?.brand?.name)
					.filter((brandName: string | undefined) => brandName)
			)
		)
	}, [user.vendorGroups])

	return (
		<div className={styles['tender']}>
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
					<p>
						Рейтинг: <span>{user.rating}</span>
					</p>
					<p>
						Количество товаров: <span>{user.vendorGroups.length}</span>
					</p>
					<div className={styles.brandWrapper}>
						{uniqueBrands.map((brandName, index) => (
							<div key={index} className={styles.brand}>
								{brandName}
							</div>
						))}
					</div>
				</div>
			</div>

			<div className={styles['tender-items']}>
				{user.vendorGroups.map((item: any) => (
					<button
						onClick={() => navigate(`/product/${item.id}`)}
						key={item.id}
						className={styles['tender-item']}
					>
						<img
							src={item.product?.images[0]?.url || 'placeholder.png'}
							className={styles['tender-image']}
						/>
						<p className={styles['tender-title']}>{item.product?.name}</p>
					</button>
				))}
			</div>

			{/* Modals */}
			{isProcentModalOpen && (
				<EditProcentModal
					user={user}
					isOpen={isProcentModalOpen}
					onClose={() => setIsProcentModalOpen(false)}
				/>
			)}
			{isDiscountModalOpen && (
				<DiscountModal
					user={user}
					isOpen={isDiscountModalOpen}
					onClose={() => setIsDiscountModalOpen(false)}
				/>
			)}
		</div>
	)
}

export default Tender
