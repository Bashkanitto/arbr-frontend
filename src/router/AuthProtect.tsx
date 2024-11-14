import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import authStore from '../store/AuthStore'

export const AuthProtect = observer(() => {
	const navigate = useNavigate()
	const isLogged = authStore.isLoggedIn

	useEffect(() => {
		if (!isLogged) {
			navigate('/auth')
		}
	}, [isLogged, navigate])

	return authStore.isLoggedIn ? <Outlet /> : null
})
