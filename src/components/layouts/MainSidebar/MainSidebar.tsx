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
				opacity: 0,
			}}
			animate={{
				transform: 'translateX(0px)',
				opacity: 1,
			}}
			transition={{
				duration: 0.8,
				type: 'spring',
			}}
		>
			<div className={styles['top']}>
				<h2 className={styles['title']}>Phase</h2>
				<MainSidebarNav />
			</div>
			<div style={{ paddingInline: '10px' }}>
				<MainSidebarManagerInfo />
			</div>
		</motion.div>
	)
}
