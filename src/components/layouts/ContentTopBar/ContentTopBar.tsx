import { useWindowScroll } from '@mantine/hooks'
import { motion } from 'framer-motion'
import styles from './ContentTopBar.module.scss'

interface ContentTopBarProps {
	title: string
}

export const ContentTopBar = ({ title }: ContentTopBarProps) => {
	const [scroll] = useWindowScroll()

	const isScroll = scroll.y > 85
	console.log(scroll)

	return (
		<motion.div
			className={styles['content-top-bar']}
			initial={{
				transform: 'translateY(-50px)',
				opacity: 0,
			}}
			animate={{
				transform: !isScroll ? 'translateY(0px)' : 'translateY(-30px)',
				opacity: !isScroll ? 1 : 0,
			}}
			transition={{
				duration: 0.8,
				type: 'spring',
			}}
		>
			{title}
		</motion.div>
	)
}
