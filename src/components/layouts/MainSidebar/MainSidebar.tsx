import { motion } from 'framer-motion'
import styles from './MainSidebar.module.scss'
import { MainSidebarManagerInfo } from './MainSidebarManagerInfo'
import { MainSidebarNav } from './MainSidebarNav'

export const MainSidebar = () => {
	return (
		<motion.div
			className={styles['main-sidebar']}
			initial={{
				transform: 'translateX(-50px)',
			}}
			animate={{
				transform: 'translateX(0px)',
			}}
			transition={{
				duration: 0.2,
				type: 'spring',
			}}
		>
			<div className={styles['top']}>
				<img src='/images/fullLogo.svg' className={styles.logo} alt='' />
				<MainSidebarNav />
			</div>
			<div style={{ paddingInline: '10px' }}>
				<MainSidebarManagerInfo />
			</div>
		</motion.div>
	)
}
