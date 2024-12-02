import React, { useEffect, useState } from 'react'
import styles from './Notification.module.scss'

interface NotificationProps {
	message: string
	type: 'success' | 'error'
	onMenuOpen?: () => void
}

const Notification: React.FC<NotificationProps> = ({
	message,
	type,
	onMenuOpen,
}) => {
	const [visible, setVisible] = useState(true)

	// Автоматическое скрытие через 5 секунд
	useEffect(() => {
		const timer = setTimeout(() => {
			setVisible(false)
		}, 5000)
		return () => clearTimeout(timer)
	}, [])

	if (!visible) return null // Если уведомление скрыто, ничего не рендерим

	return (
		<div
			className={`${styles.notification} ${styles[type]} ${styles.slideIn}`}
			onClick={onMenuOpen} // Открываем меню при клике
		>
			{message}
		</div>
	)
}

export default Notification
