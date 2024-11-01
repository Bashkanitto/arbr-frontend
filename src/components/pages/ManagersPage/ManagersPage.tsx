import { ContentLayout } from '../../layouts/ContentLayout'
import { ContentTopBar } from '../../layouts/ContentTopBar'
import { ContentUserInfo } from '../../layouts/ContentUserInfo'
import { ManagersPageCharts } from './ManagersPageCharts'
import { ManagersPageTabs } from './ManagersPageTabs'

const ManagersPage = () => {
	return (
		<ContentLayout
			header={
				<>
					<ContentTopBar title='Панель управления' />
					<ContentUserInfo />
				</>
			}
		>
			<ManagersPageTabs />
			<ManagersPageCharts />
		</ContentLayout>
	)
}

export default ManagersPage
