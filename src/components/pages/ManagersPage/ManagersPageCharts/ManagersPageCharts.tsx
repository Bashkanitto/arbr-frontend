import ConfirmatedUsers from './ConfirmatedUsers/ConfirmatedUsers'
import LastRegisterChart from './LastRegisterChart/LastRegisterChart'
import styles from './ManagersPageCharts.module.scss'

export const ManagersPageCharts = () => {
	return (
		<div className={styles['managers-page-charts']}>
			<div className={styles['chart']}>
				<LastRegisterChart />
			</div>
			<div className={styles['chart']}>
				<ConfirmatedUsers />
			</div>
		</div>
	)
}
