import { ContentLayout } from "@components/layouts/ContentLayout";
import { ContentTopBar } from "@components/layouts/ContentTopBar";
import { ContentUserInfo } from "@components/layouts/ContentUserInfo";
import CatalogTable from './CatalogTable/CatalogTable'

const CatalogPage = () => {

  return (
    <>
    <ContentLayout
        header={
          <>
            <ContentTopBar title="Каталог" />
            <ContentUserInfo />
          </>
        }
      >
      <CatalogTable />
    </ContentLayout>
    </>

  )
}

export default CatalogPage
