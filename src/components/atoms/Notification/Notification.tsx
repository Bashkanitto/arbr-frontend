import { observer } from 'mobx-react-lite'
import notificationStore from '../../../store/NotificationStore'
import styles from './Notification.module.scss'

export const Notification = observer(() => {
	const { notifications } = notificationStore

	// Показываем только непрочитанные уведомления
	const unreadNotifications = notifications.filter(notif => !notif.isRead)
	if (!unreadNotifications.length) return null

	const lastNotification = unreadNotifications[unreadNotifications.length - 1]

	return (
		<div className={`${styles.notification} ${styles[lastNotification.type]}`}>
			{lastNotification.message}
		</div>
	)
})
