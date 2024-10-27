import { createTheme } from '@mantine/core'
import { SelectExtend } from '../components/atoms/Select'
import { TableExtend } from '../components/atoms/Table'
import { TabsExtend } from '../components/atoms/Tabs'

export const themeConfig = createTheme({
	primaryColor: 'violet',
	primaryShade: { light: 4, dark: 8 },
	colors: {},

	components: {
		// Button: Button.extend({
		// 	styles: {
		// 		root: {
		// 			height: 48,
		// 			paddingInline: 36,
		// 			paddingBlock: 15,
		// 			borderRadius: 15,
		// 			background: '#6F73F3',
		// 			outline: 'none',
		// 			fontSize: 15,
		// 			fontWeight: 400,
		// 			color: '#fff',
		// 		},
		// 	},
		// }),
		Select: SelectExtend,
		Tabs: TabsExtend,
		Table: TableExtend,
	},
})
