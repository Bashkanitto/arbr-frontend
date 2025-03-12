import { ContentLayout } from "@components/layouts/ContentLayout";
import { ContentTopBar } from "@components/layouts/ContentTopBar";
import { ContentUserInfo } from "@components/layouts/ContentUserInfo";
import styles from "./SecurityPage.module.scss";
import { SecurityPageTable } from "./SecurityPage/SecurityPageTable";

const SecurityPage = () => {
  return (
    <ContentLayout
      className={styles["withdraws-page"]}
      header={
        <>
          <ContentTopBar title="Безопасность" />
          <ContentUserInfo />
        </>
      }
    >
      <div>
        <SecurityPageTable />
      </div>
    </ContentLayout>
  );
};

export default SecurityPage;
