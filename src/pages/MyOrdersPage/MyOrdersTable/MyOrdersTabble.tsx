/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select, Skeleton } from "@mantine/core";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useEffect, useState } from "react";
import { fetchMyOrders } from "@services/api/productService";
import { Table } from "@components/atoms/Table";
import styles from "./MyOrdersTable.module.scss";

export const MyOrdersTable = () => {
  const [productData, setProductData] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response: any = await fetchMyOrders();
        setProductData(response.records);
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
        setProductData([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (loading) return <Skeleton />;
  if (error) return <div>Error: {error}</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "inactive":
        return "danger";
      default:
        return "";
    }
  };

  const getLocalizedStatus = (status: string): string => {
    switch (status) {
      case "active":
        return "Активен";
      case "pending":
        return "В ожидании";
      case "inactive":
        return "Отклонён";
      default:
        return "Неизвестно";
    }
  };

  const renderRow = () => {
    const filteredData = statusFilter
      ? productData.filter((item) => item.product.status === statusFilter)
      : productData;

    if (!Array.isArray(filteredData)) return null;

    return filteredData.map((item) => (
      <Table.Tr key={item.id}>
        <Table.Td>{item.id}</Table.Td>
        <Table.Td>{item.user.firstName ?? "Неизвестно"}</Table.Td>
        <Table.Td className={styles.statusRow}>
          <p
            className={`${styles.status} ${getStatusColor(
              item.status
            )} ${getStatusColor(item.status)}bg`}
          >
            {getLocalizedStatus(item.status)}
          </p>
        </Table.Td>
        <Table.Td>{item.productPrice} ₸</Table.Td>
        <Table.Td style={{ textAlign: "end" }}>
          {format(new Date(item.createdAt), "dd MMMM, yyyy", {
            locale: ru,
          })}
        </Table.Td>
      </Table.Tr>
    ));
  };

  return (
    <>
      <div className={styles["security-page-table-head"]}>
        <div>
          <input type="text" placeholder="Поиск" />
          <Select
            placeholder="Статус"
            value={statusFilter}
            data={[
              { value: "", label: "Все" },
              { value: "active", label: "Разрешено" },
              { value: "pending", label: "В ожидании" },
              { value: "inactive", label: "Отклонено" },
            ]}
            onChange={(value) => setStatusFilter(value)}
          />
        </div>
      </div>
      <div className={styles["security-page-table"]}>
        <Table stickyHeader>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID заказа</Table.Th>
              <Table.Th>Покупатель</Table.Th>
              <Table.Th>Статус</Table.Th>
              <Table.Th>Сумма</Table.Th>
              <Table.Th style={{ textAlign: "end" }}>Дата</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{renderRow()}</Table.Tbody>
        </Table>
      </div>
    </>
  );
};
