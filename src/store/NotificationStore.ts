import { makeAutoObservable } from 'mobx'

interface Notification {
	id: number
	message: string
	title: string
	type: 'success' | 'error'
}

class NotificationStore {
	notifications: Notification[] = []
	isMenuOpen = false
	isNotification = false

	constructor() {
		makeAutoObservable(this)
		this.loadNotificationsFromLocalStorage()
	}

	// Загрузка уведомлений из localStorage
	loadNotificationsFromLocalStorage() {
		const storedNotifications = localStorage.getItem('notifications')
		if (storedNotifications) {
			this.notifications = JSON.parse(storedNotifications)
		}
	}

	// Сохранение уведомлений в localStorage
	saveNotificationsToLocalStorage() {
		localStorage.setItem('notifications', JSON.stringify(this.notifications))
	}

	// Добавить уведомление
	addNotification = (
		title: string,
		message: string,
		type: 'success' | 'error'
	) => {
		const id = Date.now()
		this.isNotification = true
		const newNotification = { id, title, message, type }
		this.notifications.push(newNotification)
		this.saveNotificationsToLocalStorage() // Сохранить в localStorage

		// Удалить уведомление через 5 секунд
		setTimeout(() => {
			this.removeNotification(id)
		}, 5000)
	}

	// Удалить уведомление
	removeNotification = (id: number) => {
		this.notifications = this.notifications.filter(notif => notif.id !== id)
		if (this.notifications.length === 0) {
			this.isNotification = false
		}
		this.saveNotificationsToLocalStorage() // Сохранить в localStorage
	}

	// Очистить все уведомления
	clearNotifications = () => {
		this.isNotification = false
		this.notifications = []
		this.saveNotificationsToLocalStorage() // Сохранить в localStorage
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
