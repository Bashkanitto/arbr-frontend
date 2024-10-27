import { ContentLayout } from '../../layouts/ContentLayout'
import { ContentTopBar } from '../../layouts/ContentTopBar'
import { ContentUserInfo } from '../../layouts/ContentUserInfo'
import styles from './WithdrawsPage.module.scss'
import { WithdrawsPageChart } from './WithdrawsPageChart/WithdrawsPageChart'
import { WithdrawsPageData } from './WithdrawsPageData/WithdrawsPageData'
import { WithdrawsPageTable } from './WithdrawsPageTable/WithdrawPageTable'

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
			<div className={styles['']}>
				<WithdrawsPageTable />
			</div>
		</ContentLayout>
	)
}

export default WithdrawsPage
