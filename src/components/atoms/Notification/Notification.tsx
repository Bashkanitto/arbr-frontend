import { observer } from 'mobx-react-lite'
import notificationStore from '../../../store/NotificationStore'
import styles from './Notification.module.scss'

export const Notification = observer(() => {
	const { notifications, isNotification } = notificationStore

	if (!isNotification) return null
	const lastIndex = notifications.length - 1

	return (
		<div className={styles.notification}>
			<div
				className={`${styles.notification} ${
					styles[notifications[lastIndex].type]
				}`}
			>
				{notifications[lastIndex].message}
			</div>
		</div>
	)
})
