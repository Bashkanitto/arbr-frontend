import { makeAutoObservable } from 'mobx'

interface Notification {
	id: number
	message: string
	title: string
	type: 'success' | 'error'
}

class NotificationStore {
	notifications: Notification[] = [
		{
			id: 0,
			message:
				'Уважаемый, Самса Сенсей! Ваш продукт по номеру ‘2225865’ нарушает правила политики безопасности, и нам приходится отказать добавлять этот товар в ваш профиль',
			title: 'Ваш продукт не одобрен',
			type: 'error',
		},
	]
	isMenuOpen = false
	isNotification = false

	constructor() {
		makeAutoObservable(this)
	}

	// Добавить уведомление
	addNotification = (
		message: string,
		title: string,
		type: 'success' | 'error'
	) => {
		const id = Date.now()
		this.isNotification = true
		this.notifications.push({ id, message, title, type })
	}

	// Удалить уведомление
	removeNotification = (id: number) => {
		this.isNotification = false
		this.notifications = this.notifications.filter(notif => notif.id !== id)
	}

	// Открыть меню уведомлений
	openMenu = () => {
		this.isMenuOpen = true
	}

	// Закрыть меню уведомлений
	closeMenu = () => {
		this.isMenuOpen = false
	}
}

export default new NotificationStore()
