import { ContentLayout } from '@components/layouts/ContentLayout'
import { ContentTopBar } from '@components/layouts/ContentTopBar'
import { ContentUserInfo } from '@components/layouts/ContentUserInfo'
import styles from './PaymentRequestPage.module.scss'
import { PaymentRequestTable } from './PaymentRequestTable'

const PaymentRequestPage = () => {
  return (
    <ContentLayout
      className={styles['paymentRequest-page']}
      header={
        <>
          <ContentTopBar title="Запрос на вывод" />
          <ContentUserInfo />
        </>
      }
    >
      <div className={styles['']}>
        <PaymentRequestTable />
      </div>
    </ContentLayout>
  )
}

export default PaymentRequestPage
