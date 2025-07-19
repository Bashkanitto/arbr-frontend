import { Box } from "@shared/ui/Box";
import BigRequestChart from "./BigRequestsChart/BigRequestsChart";
import { default as ConfirmatedUsersChart } from "./ConfirmatedUsersCart/ConfirmatedUsersChart";
import LastRegisterChart from "./LastRegisterChart/LastRegisterChart";
import styles from "./ManagersPageCharts.module.scss";
import TopProductsChart from "./TopProductsChart/TopProductsChart";

export const ManagersPageCharts = () => {
  return (
    <div className={styles["managers-page-charts"]}>
      <Box className={styles["chart"]}>
        <LastRegisterChart />
      </Box>
      <div className={styles["chart"]}>
        <ConfirmatedUsersChart />
      </div>
      <div className={styles["chart"]}>
        <TopProductsChart />
      </div>
      <div className={styles["chart"]}>
        <BigRequestChart />
      </div>
    </div>
  );
};
