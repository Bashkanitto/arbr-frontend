import { PhoneIcon } from '../../../../assets/icons'
import { UserInfo } from '../../../molecules'
import styles from './MainSidebarManagerInfo.module.scss'

export const MainSidebarManagerInfo = () => {
	return (
		<div className={styles['main-sidebar-manager-info']}>
			<UserInfo
				avatar={<img src='/images/manager_photo.png' alt='logo' />}
				title='Аслан ага'
				description='Ваш менеджер'
			/>
			<div className={styles['phone']}>
				<PhoneIcon />
				<span>8 (701) 552 61 52</span>
			</div>
		</div>
	)
}
