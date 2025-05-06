import { Tabs } from '@mantine/core'
import styles from './Tabs.module.scss'

export const TabsExtend = Tabs.extend({
	classNames: {
		root: styles['tabs'],
		list: styles['tabs-list'],
		tab: styles['tabs-tab'],
	},
})

export { Tabs }
