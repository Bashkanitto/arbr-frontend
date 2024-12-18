import { ContentLayout } from '../../layouts/ContentLayout'
import { ContentTopBar } from '../../layouts/ContentTopBar'
import { ContentUserInfo } from '../../layouts/ContentUserInfo'
import styles from './MyOrdersPage.module.scss'
import { MyOrdersTable } from './MyOrdersTable/MyOrdersTabble'

const MyOrdersPage = () => {
	return (
		<ContentLayout
			className={styles['withdraws-page']}
			header={
				<>
					<ContentTopBar title='Заявки' />
					<ContentUserInfo />
				</>
			}
		>
			<div>{<MyOrdersTable />}</div>
		</ContentLayout>
	)
}

export default MyOrdersPage
