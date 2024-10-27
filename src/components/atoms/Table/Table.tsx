import { Table } from '@mantine/core'
import styles from './Table.module.scss'

export const TableExtend = Table.extend({
	classNames: {
		table: styles['table'],
		thead: styles['table-thead'],
		th: styles['table-th'],
		tbody: styles['table-tbody'],
		tr: styles['table-tr'],
		td: styles['table-td'],
	},
})

export { Table }
