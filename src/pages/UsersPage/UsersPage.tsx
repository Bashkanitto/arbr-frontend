import { ContentLayout } from '@components/layouts/ContentLayout'
import { ContentTopBar } from '@components/layouts/ContentTopBar'
import { ContentUserInfo } from '@components/layouts/ContentUserInfo'
import styles from './UsersPage.module.scss'
import { UsersTable } from './UsersTable/UsersTable'

const UsersPage = () => {
  return (
    <ContentLayout
      className={styles['withdraws-page']}
      header={
        <>
          <ContentTopBar title="Пользователи" />
          <ContentUserInfo />
        </>
      }
    >
      <div>
        <UsersTable />
      </div>
    </ContentLayout>
  )
}

export default UsersPage
