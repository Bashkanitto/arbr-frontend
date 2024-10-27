import { ContentLayout } from '../../layouts/ContentLayout'
import { ContentTopBar } from '../../layouts/ContentTopBar'
import { ContentUserInfo } from '../../layouts/ContentUserInfo'
import styles from './WithdrawsPage.module.scss'
import { WithdrawsPageChart } from './WithdrawsPageChart/WithdrawsPageChart'
import { WithdrawsPageData } from './WithdrawsPageData/WithdrawsPageData'

const WithdrawsPage = () => {
	return (
		<ContentLayout
			className={styles['withdraws-page']}
			header={
				<>
					<ContentTopBar title='Выплаты' />
					<ContentUserInfo />
				</>
			}
		>
			<div className={styles['content']}>
				<WithdrawsPageChart />
				<WithdrawsPageData />
			</div>
			<div className={styles['bottom']}></div>
		</ContentLayout>
	)
}

export default WithdrawsPage
