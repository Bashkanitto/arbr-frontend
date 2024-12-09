import { observer } from 'mobx-react-lite'
import notificationStore from '../../../store/NotificationStore'
import styles from './Notification.module.scss'

export const Notification = observer(() => {
	const { notifications } = notificationStore

	if (!notifications.length) return null
	const lastNotification = notifications[notifications.length - 1]

	return (
		<div className={`${styles.notification} ${styles[lastNotification.type]}`}>
			{lastNotification.message}
		</div>
	)
})
