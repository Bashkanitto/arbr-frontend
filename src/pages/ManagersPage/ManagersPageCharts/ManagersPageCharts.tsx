import { Box } from '@shared/ui/Box'
import BigRequestChart from './BigRequestsChart/BigRequestsChart'
import { default as ConfirmatedUsersChart } from './ConfirmatedUsersCart/ConfirmatedUsersChart'
import LastRegisterChart from './LastRegisterChart/LastRegisterChart'
import styles from './ManagersPageCharts.module.scss'
import TopProductsChart from './TopProductsChart/TopProductsChart'

export const ManagersPageCharts = () => {
  return (
    <div className={styles['managers-page-charts']}>
      <Box className={styles['chart']}>
        <LastRegisterChart />
      </Box>
      <Box className={styles['chart']}>
        <ConfirmatedUsersChart />
      </Box>
      <Box className={styles['chart']}>
        <TopProductsChart />
      </Box>
      <Box className={styles['chart']}>
        <BigRequestChart />
      </Box>
    </div>
  )
}
