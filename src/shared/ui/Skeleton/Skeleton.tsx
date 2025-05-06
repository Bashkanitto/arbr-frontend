import { Skeleton } from '@mantine/core'
import styles from './Skeleton.module.scss'

export const SkeletonExtend = Skeleton.extend({
	classNames: {
		root: styles['skeleton'],
	},
})

export { Skeleton }
