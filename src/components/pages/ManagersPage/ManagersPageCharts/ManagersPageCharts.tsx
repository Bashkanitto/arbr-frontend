import ConfirmatedUsers from './ConfirmatedUsers/ConfirmatedUsers'
import LastRegisterChart from './LastRegisterChart/LastRegisterChart'
import styles from './ManagersPageCharts.module.scss'
import TopProducts from './TopProducts/TopProducts'

export const ManagersPageCharts = () => {
	return (
		<div className={styles['managers-page-charts']}>
			<div className={styles['chart']}>
				<LastRegisterChart />
			</div>
			<div className={styles['chart']}>
				<ConfirmatedUsers />
			</div>
			<div className={styles['chart']}>
				<TopProducts />
			</div>
			<div className={styles['chart']}>
				<ConfirmatedUsers />
			</div>
		</div>
	)
}
