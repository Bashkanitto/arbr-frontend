import authStore from '../../../store/AuthStore'
import { ContentLayout } from '../../layouts/ContentLayout'
import { ContentTopBar } from '../../layouts/ContentTopBar'
import { ContentUserInfo } from '../../layouts/ContentUserInfo'
import styles from './ApplicationPage.module.scss'
import { ApplicationTable } from './ApplicationTabble/ApplicationTabble'
import { ApplicationTableAdmin } from './ApplicationTabble/ApplicationTabbleAdmin'

const ApplicationPage = () => {
	const { isAdmin } = authStore

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
			<div>{isAdmin ? <ApplicationTableAdmin /> : <ApplicationTable />}</div>
		</ContentLayout>
	)
}

export default ApplicationPage
