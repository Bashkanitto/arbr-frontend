import { ContentLayout } from '@components/layouts/ContentLayout'
import { ContentTopBar } from '@components/layouts/ContentTopBar'
import { ContentUserInfo } from '@components/layouts/ContentUserInfo'
import styles from './MyOrdersPage.module.scss'
import { OrdersTable } from './OrdersTable'

const OrdersPage = () => {
  return (
    <ContentLayout
      className={styles['withdraws-page']}
      header={
        <>
          <ContentTopBar title="Заказы" />
          <ContentUserInfo />
        </>
      }
    >
      <div>
        <OrdersTable />
      </div>
    </ContentLayout>
  )
}

export default OrdersPage
