import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import authStore from '../store/AuthStore'

interface UserProfile {
	role: string
}

interface AuthStore {
	isLoggedIn: boolean
	userProfile?: UserProfile | null
}

interface AuthProtectProps {
	allowedRoles?: string[]
}

export const AuthProtect = observer(({ allowedRoles }: AuthProtectProps) => {
	const navigate = useNavigate()
	const { isLoggedIn, userProfile } = authStore as AuthStore

	useEffect(() => {
		// Проверка авторизован ли
		if (!isLoggedIn) {
			navigate('/auth')
		} else if (
			// Если нет ролей перенаправлять на главную
			allowedRoles &&
			(!userProfile || !allowedRoles.includes(userProfile.role))
		) {
			navigate('/')
		}
	}, [isLoggedIn, userProfile, allowedRoles, navigate])

	return isLoggedIn &&
		(!allowedRoles ||
			(userProfile && allowedRoles.includes(userProfile.role))) ? (
		<Outlet />
	) : null
})
