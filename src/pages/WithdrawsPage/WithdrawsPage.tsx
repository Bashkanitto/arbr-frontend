import { ContentLayout } from '@components/layouts/ContentLayout'
import { ContentTopBar } from '@components/layouts/ContentTopBar'
import { ContentUserInfo } from '@components/layouts/ContentUserInfo'
import TransactionList from './TransactionList/TransactionList'
import styles from './WithdrawsPage.module.scss'
import WithdrawsPageChart from './WithdrawsPageChart/WithdrawsPageChart'
import { WithdrawsPageTable } from './WithdrawsPageTable'

const WithdrawsPage = () => {
  return (
    <ContentLayout
      className={styles['withdraws-page']}
      header={
        <>
          <ContentTopBar title="Выплаты" />
          <ContentUserInfo />
        </>
      }
    >
      <div className={styles['content']}>
        <div className={styles['chart']}>
          <WithdrawsPageChart />
        </div>
        <div className={styles['chart']}>
          <TransactionList />
        </div>
      </div>
      <div className={styles['']}>
        <WithdrawsPageTable />
      </div>
    </ContentLayout>
  )
}

export default WithdrawsPage
