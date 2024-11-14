import { useWindowScroll } from '@mantine/hooks'
import { motion } from 'framer-motion'
import { observer } from 'mobx-react-lite'
// import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchIcon } from '../../../assets/icons'
import { SignOut } from '../../../assets/icons/SignOut'
import authStore from '../../../store/AuthStore'
import { Avatar } from '../../atoms/Avatar'
import { IconButton } from '../../atoms/Button/IconButton'
import { Skeleton } from '../../atoms/Skeleton'
import { UserInfo } from '../../molecules'
import styles from './ContentUserInfo.module.scss'

export const ContentUserInfo = observer(() => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, react-hooks/rules-of-hooks
	const [scroll] = useWindowScroll()
	const { userProfile } = authStore
	const navigate = useNavigate()
	if (!userProfile) return null

	const isScroll = scroll.y > 100

	async function logout() {
		authStore.logout()
	}

	return (
		<>
			{!userProfile ? (
				<Skeleton width={isScroll ? 85 : 447} height='100%' radius={30} />
			) : (
				<motion.div
					className={styles['content-user-info']}
					style={{
						width: isScroll ? 85 : 447,
						padding: isScroll ? '5px' : '10px 10px 10px 18px',
					}}
					initial={{
						transform: 'translateY(-50px)',
						opacity: 0,
					}}
					animate={{
						transform: 'translateY(0px)',
						opacity: 1,
					}}
					transition={{
						duration: 0.8,
						type: 'spring',
					}}
				>
					{!isScroll ? (
						<>
							<div className={styles['left']}>
								<IconButton
									onClick={() => navigate('/search')}
									variantColor='secondary'
								>
									<SearchIcon />
								</IconButton>
								<IconButton onClick={logout} variantColor='danger'>
									<SignOut />
								</IconButton>
							</div>
							<UserInfo
								className={styles['user-info']}
								avatar={<Avatar />}
								title={userProfile?.firstName}
								description={
									(userProfile?.role == 'manager' && 'Менеджер') || 'Поставщик'
								}
							/>
						</>
					) : (
						<Avatar />
					)}
				</motion.div>
			)}
		</>
	)
})
