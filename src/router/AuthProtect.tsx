import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import authStore from '@app/AuthStore'
import { Loader } from '@mantine/core'

interface UserProfile {
  role: string
  id: number
}

interface AuthStore {
  isLoggedIn: boolean
  userProfile?: UserProfile | null
  initialized: boolean
}

interface AuthProtectProps {
  allowedRoles?: string[]
}

export const AuthProtect = observer(({ allowedRoles }: AuthProtectProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn, userProfile, initialized } = authStore as AuthStore

  useEffect(() => {
    if (!initialized) {
      return // Wait for initialization
    }

    if (!isLoggedIn) {
      navigate('/auth')
      return
    }

    // If no roles are specified, allow access
    if (!allowedRoles) {
      return
    }

    // Check if user has required role
    if (!userProfile || !allowedRoles.includes(userProfile.role)) {
      // For vendors, redirect to their vendor page
      if (userProfile?.role === 'vendor') {
        navigate(`/vendor/${userProfile.id}`)
      } else {
        navigate('/')
      }
      return
    }

    // For vendor role, ensure they're on their own vendor page
    if (userProfile.role === 'vendor' && location.pathname === '/vendor') {
      navigate(`/vendor/${userProfile.id}`)
    }
  }, [isLoggedIn, userProfile, allowedRoles, navigate, location.pathname, initialized])

  if (!initialized) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <Loader size={40} />
      </div>
    )
  }

  return isLoggedIn &&
    (!allowedRoles || (userProfile && allowedRoles.includes(userProfile.role))) ? (
    <Outlet />
  ) : null
})
