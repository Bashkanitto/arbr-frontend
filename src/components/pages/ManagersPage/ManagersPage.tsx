import { ContentLayout } from '../../layouts/ContentLayout'
import { ContentTopBar } from '../../layouts/ContentTopBar'
import { ContentUserInfo } from '../../layouts/ContentUserInfo'
import { ManagersPageCharts } from './ManagersPageCharts'
import { ManagersPageTable } from './ManagersPageTable'
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
			<ManagersPageTable />
		</ContentLayout>
	)
}

export default ManagersPage
