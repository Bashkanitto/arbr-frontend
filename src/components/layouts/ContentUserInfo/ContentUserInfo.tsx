import { useWindowScroll } from '@mantine/hooks'
import { m } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { NotificationIcon } from '@shared/icons/NotificationIcon'
import { SignOutIcon } from '@shared/icons/SignOutIcon'
import authStore from '@app/AuthStore'
import { default as notificationStore } from '@features/notification/model/NotificationStore'
import { Avatar } from '@shared/ui/Avatar'
import { IconButton } from '@shared/ui/Button/IconButton'
import { Skeleton } from '@shared/ui/Skeleton'
import { UserInfo } from '../../molecules'
import styles from './ContentUserInfo.module.scss'
import { HelpDeskIcon } from '@shared/icons/HelpDeskIcon'
import { helpDeskStore } from '@features/HelpDesk/model/HelpDeskStore'

export const ContentUserInfo = observer(() => {
  const [scroll] = useWindowScroll()

  const { userProfile } = authStore
  if (!userProfile) return null

  const isScroll = scroll.y > 100

  async function logout() {
    authStore.logout()
  }

  return (
    <>
      {!userProfile ? (
        <Skeleton width={isScroll ? 85 : 447} height="100%" radius={30} />
      ) : (
        <m.div
          className={`${styles['content-user-info']} border border-gray-200`}
          style={{
            width: isScroll ? 85 : 447,
            padding: isScroll ? '5px' : '10px 10px 10px 18px',
          }}
          initial={{
            transform: 'translateY(-50px)',
            opacity: 0,
          }}
          animate={{
            transform: 'translateY(0px)',
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            type: 'spring',
          }}
        >
          {!isScroll ? (
            <>
              <div className={styles['left']}>
                <IconButton onClick={() => notificationStore.openMenu()} variantColor="secondary">
                  <NotificationIcon />
                </IconButton>
                <IconButton onClick={() => helpDeskStore.open()} variantColor="secondary">
                  <HelpDeskIcon />
                </IconButton>
                <IconButton onClick={logout} variantColor="danger">
                  <SignOutIcon />
                </IconButton>
              </div>
              <UserInfo
                className={styles['user-info']}
                avatar={<Avatar />}
                title={userProfile?.firstName}
                description={(userProfile?.role == 'admin' && 'Админ') || 'Поставщик'}
              />
            </>
          ) : (
            <Avatar />
          )}
        </m.div>
      )}
    </>
  )
})
