import { makeAutoObservable } from 'mobx'

interface Notification {
	id: number
	message: string
	title: string
	type: 'success' | 'error'
	isRead: boolean 
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
			this.markAllAsRead() // Отмечаем все уведомления как прочитанные
		}
	}

	// Сохранение уведомлений в localStorage
	saveNotificationsToLocalStorage() {
		localStorage.setItem('notifications', JSON.stringify(this.notifications))
	}

	// Пометить все уведомления как прочитанные
	markAllAsRead() {
		this.notifications = this.notifications.map(notification => ({
			...notification,
			isRead: true, // Отмечаем все уведомления как прочитанные
		}))
		this.saveNotificationsToLocalStorage()
	}

	// Добавить уведомление
	addNotification = (
		title: string,
		message: string,
		type: 'success' | 'error'
	) => {
		const id = Date.now()
		this.isNotification = true
		const newNotification = { id, title, message, type, isRead: false }
		this.notifications.push(newNotification)
		this.saveNotificationsToLocalStorage()

		// Помечаем уведомление как прочитанное через 5 секунд, вместо удаления
		setTimeout(() => {
			this.markAsRead(id)
		}, 5000)
	}

	// Пометить уведомление как прочитанное
	markAsRead = (id: number) => {
		this.notifications = this.notifications.map(notif =>
			notif.id === id ? { ...notif, isRead: true } : notif
		)
		this.saveNotificationsToLocalStorage()
	}

	// Удалить уведомление
	removeNotification = (id: number) => {
		this.notifications = this.notifications.filter(notif => notif.id !== id)
		if (this.notifications.length === 0) {
			this.isNotification = false
		}
		this.saveNotificationsToLocalStorage()
	}

	// Очистить все уведомления
	clearNotifications = () => {
		this.isNotification = false
		this.notifications = []
		this.saveNotificationsToLocalStorage()
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
