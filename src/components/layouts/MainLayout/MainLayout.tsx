import { Outlet } from 'react-router-dom'

import { observer } from 'mobx-react-lite'
import { Notification } from '@features/notification/ui/Notification'
import { NotificationMenu } from '../../molecules/NotificationMenu/NotificationMenu'
import styles from './MainLayout.module.scss'
import HelpDeskModal from '@features/HelpDesk/ui/HelpDesk'
import { helpDeskStore } from '@features/HelpDesk/model/HelpDeskStore'
import { Sidebar } from '@components/molecules/Sidebar/Sidebar'

export const MainLayout = observer(() => {
  return (
    <div className={styles['main-layout']}>
      <Sidebar />
      <Outlet />
      <NotificationMenu />
      {helpDeskStore.isOpen && <HelpDeskModal />}
      <Notification />
    </div>
  )
})
