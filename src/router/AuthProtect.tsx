import { observer } from 'mobx-react-lite'
import { Navigate, Outlet } from 'react-router-dom'

export const AuthProtect = observer(() => {
	const isAuth = true

	if (!isAuth) {
		return <Navigate to='/' />
	}

	return <Outlet />
})
