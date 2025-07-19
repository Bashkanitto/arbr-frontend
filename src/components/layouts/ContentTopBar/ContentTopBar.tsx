import { useWindowScroll } from '@mantine/hooks'
import styles from './ContentTopBar.module.scss'
import { Box } from '@shared/ui/Box'

interface ContentTopBarProps {
  title: string
}

export const ContentTopBar = ({ title }: ContentTopBarProps) => {
  const [scroll] = useWindowScroll()

  const isScroll = scroll.y > 85

  return <Box className={styles['content-top-bar']}>{title}</Box>
}
