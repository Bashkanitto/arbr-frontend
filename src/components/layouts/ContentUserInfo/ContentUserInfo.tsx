import { useWindowScroll } from '@mantine/hooks'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { SearchIcon } from '../../../assets/icons'
import { NotificationIcon } from '../../../assets/icons/NotificationIcon'
import { Avatar } from '../../atoms/Avatar'
import { IconButton } from '../../atoms/Button/IconButton'
import { Skeleton } from '../../atoms/Skeleton'
import { UserInfo } from '../../molecules/UserInfo'
import styles from './ContentUserInfo.module.scss'

export const ContentUserInfo = () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [user, setUser] = useState<any>(null)
	const [scroll] = useWindowScroll()

	const isScroll = scroll.y > 100

	useEffect(() => {
		setTimeout(() => {
			setUser({
				fullName: 'Мальсагов А.С',
				updateAt: new Date(),
				createdAt: new Date(),
				region: 'Урал',
				archive: true,
				active: true,
				profile: 'Администратор',
			})
		}, 2000)
	}, [])

	return (
		<>
			{!user ? (
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
								<IconButton variantColor='secondary'>
									<SearchIcon />
								</IconButton>
								<IconButton variantColor='secondary'>
									<NotificationIcon />
								</IconButton>
							</div>
							<UserInfo
								className={styles['user-info']}
								avatar={<Avatar />}
								title={user?.fullName}
								description={user?.profile}
							/>
						</>
					) : (
						<Avatar />
					)}
				</motion.div>
			)}
		</>
	)
}
