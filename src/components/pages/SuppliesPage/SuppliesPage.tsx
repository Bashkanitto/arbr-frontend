import { ContentLayout } from '../../layouts/ContentLayout'
import { ContentTopBar } from '../../layouts/ContentTopBar'
import { ContentUserInfo } from '../../layouts/ContentUserInfo'
import { WithdrawsPageTable } from '../WithdrawsPage/WithdrawsPageTable/WithdrawsPageTable'
import styles from './SuppliesPage.module.scss'

const SuppliesPage = () => {
	return (
		<ContentLayout
			className={styles['supplies-page']}
			header={
				<>
					<ContentTopBar title='Мои поставки' />
					<ContentUserInfo />
				</>
			}
		>
			<div className={styles['']}>
				<WithdrawsPageTable />
			</div>
		</ContentLayout>
	)
}

export default SuppliesPage
