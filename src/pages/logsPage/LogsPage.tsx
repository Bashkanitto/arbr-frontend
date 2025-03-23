import { ContentLayout } from '@components/layouts/ContentLayout'
import { ContentTopBar } from '@components/layouts/ContentTopBar'
import { ContentUserInfo } from '@components/layouts/ContentUserInfo'
import styles from '../WithdrawsPage/WithdrawsPage.module.scss'
import LogsTable from './LogsTable'

const LogsPage = () => {
  return (
    <ContentLayout
      className={styles['withdraws-page']}
      header={
        <>
          <ContentTopBar title="Логи" />
          <ContentUserInfo />
        </>
      }
    >
      <div>
        <LogsTable />
      </div>
    </ContentLayout>
  )
}

export default LogsPage
