/* eslint-disable @typescript-eslint/no-explicit-any */
import { Skeleton, Table, Button, Modal, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import styles from "./BannerPage.module.scss";
import {
  createFeature,
  fetchFeatures,
  deleteFeature,
} from "../../../services/api/brandService";
import { BaseButton } from "../../atoms/Button/BaseButton";
import { DeleteIcon } from "../../../assets/icons";
import NotificationStore from "../../../store/NotificationStore";
import { Pagination } from "../../molecules/Pagination/Pagination";

const BannerPage = () => {
  const [bannerData, setBannerData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [brandId, setBrandId] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        setLoading(true);
        const response: any = await fetchFeatures(page, pageSize);
        setTotalPages(
          response.meta?.totalPages ||
            Math.ceil(response.records.length / pageSize)
        );
        setBannerData(response.records);
      } catch (err: any) {
        setError(`Не удалось загрузить данные: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadBanners();
  }, []);

  const handleCreateBanner = async () => {
    try {
      if (!brandId.trim()) {
        setError("Введите корректный номер бренда");
        return;
      }

      const numericBrandId = Number(brandId);
      if (isNaN(numericBrandId)) {
        setError("Номер бренда должен быть числом");
        return;
      }

      setIsCreating(true);
      const response: any = await createFeature(numericBrandId, page, pageSize);
      const newBrand = response.records;
      setBannerData([...bannerData, newBrand]);
      setIsCreateModalOpen(false);
      setBrandId("");

      NotificationStore.addNotification(
        "Добавление баннера",
        "Баннер успешно создан",
        "success"
      );
    } catch (err: any) {
      console.log(`Не удалось создать баннер: ${err.message}`);
      NotificationStore.addNotification(
        "Добавление баннера",
        "Ошибка при создании баннера",
        "error"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    try {
      await deleteFeature(id).then((response) =>
        response?.status === 204
          ? setBannerData(bannerData.filter((banner) => banner.id !== id))
          : NotificationStore.addNotification(
              "Удаление баннера",
              "Ошибка при удалении баннера",
              "error"
            )
      );
    } catch (err: any) {
      setError(`Не удалось удалить баннер: ${err.message}`);
    }
  };

  if (loading) return <Skeleton />;

  const renderRow = () => {
    return bannerData.map((item) => (
      <Table.Tr key={item.id}>
        <Table.Td>{item.id}</Table.Td>
        <Table.Td>{item.brand.name}</Table.Td>
        <Table.Td>{item.brand.features?.discount}</Table.Td>
        <Table.Td style={{ width: "50px", padding: "0" }}>
          <DeleteIcon onClick={() => handleDeleteBanner(item.id)} />
        </Table.Td>
      </Table.Tr>
    ));
  };

  return (
    <>
      <div className={styles["security-page-table"]}>
        <div className={styles["security-page-table-head"]}>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
          <BaseButton onClick={() => setIsCreateModalOpen(true)}>
            Создать Баннер
          </BaseButton>
        </div>
        <Table stickyHeader>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Номер</Table.Th>
              <Table.Th>Название</Table.Th>
              <Table.Th>Скидки</Table.Th>
              <Table.Th style={{ width: "150px", padding: "0" }}>
                Действие
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{renderRow()}</Table.Tbody>
        </Table>
      </div>

      <Modal
        opened={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Добавить Баннер"
      >
        {error && <div style={{ color: "red" }}>{error}</div>}
        <TextInput
          type="number"
          label="Номер Бренда"
          value={brandId}
          onChange={(event) => setBrandId(event.target.value)}
        />
        <Button
          style={{ marginTop: "20px" }}
          onClick={handleCreateBanner}
          loading={isCreating}
        >
          Добавить
        </Button>
      </Modal>
    </>
  );
};

export default BannerPage;
