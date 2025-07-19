import { ContentLayout } from "@components/layouts/ContentLayout";
import { ContentTopBar } from "@components/layouts/ContentTopBar";
import { ContentUserInfo } from "@components/layouts/ContentUserInfo";
import { ManagersPageCharts } from "./ManagersPageCharts";

const ManagersPage = () => {
  return (
    <ContentLayout
      header={
        <>
          <ContentTopBar title="Панель управления" />
          <ContentUserInfo />
        </>
      }
    >
      {/* <ManagersPageTabs /> */}
      <ManagersPageCharts />
    </ContentLayout>
  );
};

export default ManagersPage;
