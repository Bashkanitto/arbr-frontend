import styles from './Avatar.module.scss'

interface AvatarProps {
  src?: string
  className?: string
  w?: number
  h?: number
}

export const Avatar = ({ src = '/images/user_photo.png', className,w=50,h=50 }: AvatarProps) => {
  return <img className={`${styles['avatar']} ${className}`} src={src} alt="logo" width={w} height={h} />
}
