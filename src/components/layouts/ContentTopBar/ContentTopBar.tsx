import { useWindowScroll } from '@mantine/hooks'
import styles from './ContentTopBar.module.scss'

interface ContentTopBarProps {
  title: string
}

export const ContentTopBar = ({ title }: ContentTopBarProps) => {
  const [scroll] = useWindowScroll()

  const isScroll = scroll.y > 85

  return <div className={styles['content-top-bar']}>{title}</div>
}
