import { Outlet } from 'react-router-dom'
import { cn } from '../../../helpers'

import { MainSidebar } from '../MainSidebar'
import styles from './MainLayout.module.scss'

export const MainLayout = () => {
	return (
		<div className={cn(styles['main-layout'])}>
			<MainSidebar />
			<Outlet />
		</div>
	)
}
