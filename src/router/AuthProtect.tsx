import { observer } from 'mobx-react-lite'
import { Outlet, useNavigate } from 'react-router-dom'
import AuthPage from '../components/pages/AuthPage/AuthPage'

export const AuthProtect = observer(() => {
	const isAuth = true
	const navigate = useNavigate()

	if (!isAuth) {
		navigate('/auth')
		return <AuthPage />
	}

	return <Outlet />
})
