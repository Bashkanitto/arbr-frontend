import { Outlet } from 'react-router-dom'
import { cn } from '../../../helpers'

import { observer } from 'mobx-react-lite'
import { Notification } from '../../atoms/Notification/Notification'
import { NotificationMenu } from '../../molecules/NotificationMenu/NotificationMenu'
import { MainSidebar } from '../MainSidebar'
import styles from './MainLayout.module.scss'

export const MainLayout = observer(() => {
	return (
		<div className={cn(styles['main-layout'])}>
			<MainSidebar />
			<Outlet />
			<NotificationMenu />
			<Notification />
		</div>
	)
})
