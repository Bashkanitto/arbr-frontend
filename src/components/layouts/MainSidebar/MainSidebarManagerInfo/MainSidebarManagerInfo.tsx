import { PhoneIcon } from '../../../../assets/icons'
import { UserInfo } from '../../../molecules/UserInfo'
import styles from './MainSidebarManagerInfo.module.scss'

export const MainSidebarManagerInfo = () => {
	return (
		<div className={styles['main-sidebar-manager-info']}>
			<UserInfo
				avatar={<img src='/images/manager_photo.png' alt='logo' />}
				title='Иванов Иван'
				description='Ваш менеджер'
			/>
			<div className={styles['phone']}>
				<PhoneIcon />
				<span>8 (800) 152-15-25</span>
			</div>
		</div>
	)
}
