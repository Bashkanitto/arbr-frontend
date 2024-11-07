import { observer } from 'mobx-react-lite'
import { Outlet, useNavigate } from 'react-router-dom'
import authStore from '../store/AuthStore'

export const AuthProtect = observer(() => {
	const navigate = useNavigate()

	if (!authStore.isLoggedIn) {
		navigate('/auth')
	} else {
		navigate('/managers')
	}

	return <Outlet />
})
