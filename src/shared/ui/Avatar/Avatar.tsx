import styles from './Avatar.module.scss'

interface AvatarProps {
  src?: string
}

export const Avatar = ({ src = '/images/user_photo.png' }: AvatarProps) => {
  return <img className={styles['avatar']} src={src} alt="logo" width={65} height={65} />
}
