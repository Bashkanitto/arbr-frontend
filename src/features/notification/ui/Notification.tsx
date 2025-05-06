import { observer } from 'mobx-react-lite'
import notificationStore from '@features/notification/model/NotificationStore'
import styles from './Notification.module.scss'

export const Notification = observer(() => {
  const { notifications, isNotification } = notificationStore

  // Показываем только непрочитанные уведомления
  const unreadNotifications = notifications.filter(notif => !notif.isRead)
  if (!unreadNotifications.length || !isNotification) return null

  const lastNotification = unreadNotifications[unreadNotifications.length - 1]

  return (
    <div
      className={`${styles.notification} ${styles[lastNotification.type]}`}
      onClick={() => notificationStore.markAsRead(lastNotification.id)}
    >
      <div className={styles.title}>{lastNotification.title}</div>
      <div className={styles.message}>{lastNotification.message}</div>
    </div>
  )
})
