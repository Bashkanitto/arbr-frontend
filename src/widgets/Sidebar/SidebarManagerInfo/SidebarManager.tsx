import { PhoneIcon } from '@shared/icons'
import { UserInfo } from '@components/molecules'
import styles from './SidebarManager.module.scss'

export const SidebarManager = () => {
  return (
    <div className={styles['sidebar-manager-info']}>
      <UserInfo
        avatar={<img src="/images/manager_photo.png" alt="logo" />}
        title="Курмангалиев Аслан"
        description="Ваш менеджер"
      />
      <div className={styles['phone']}>
        <PhoneIcon />
        <span>8 (701) 552 61 52</span>
      </div>
    </div>
  )
}
