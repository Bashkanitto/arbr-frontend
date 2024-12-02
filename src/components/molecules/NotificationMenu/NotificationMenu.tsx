import React, { useState } from 'react'
import Notification from '../../atoms/Notification/Notification'

const NotificationMenu: React.FC = () => {
	const [menuOpen, setMenuOpen] = useState(false)

	const handleMenuOpen = () => {
		setMenuOpen(true)
	}

	const handleMenuClose = () => {
		setMenuOpen(false)
	}

	return (
		<div>
			<Notification
				message='Успех! Данные сохранены.'
				type='success'
				onMenuOpen={handleMenuOpen}
			/>
			<Notification
				message='Ошибка! Что-то пошло не так.'
				type='error'
				onMenuOpen={handleMenuOpen}
			/>

			{menuOpen && (
				<div className='notification-menu'>
					<h3>Меню уведомлений</h3>
					<button onClick={handleMenuClose}>Закрыть</button>
				</div>
			)}
		</div>
	)
}

export default NotificationMenu
