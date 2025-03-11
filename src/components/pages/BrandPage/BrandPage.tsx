/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Skeleton,
  Table,
  Button,
  Modal,
  TextInput,
  Input,
} from "@mantine/core";
import { Pagination } from "../../molecules/Pagination/Pagination";
import { useEffect, useState } from "react";
import styles from "./BrandPage.module.scss";
import {
  createBrand,
  deleteBrand,
  fetchBrandsPage,
} from "../../../services/api/brandService";
import { BaseButton } from "../../atoms/Button/BaseButton";
import { DeleteIcon } from "../../../assets/icons";
import NotificationStore from "../../../store/NotificationStore";

interface Brand {
  id: string;
  name: string;
  image?: {
    url: string;
  };
  rating: number;
  createdAt: string;
  status: "active" | "inactive";
}

const BrandPage = () => {
  const [brandData, setBrandData] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newBrandName, setNewBrandName] = useState<string>("");
  const [newBrandImage, setNewBrandImage] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        setLoading(true);
        const response: any = await fetchBrandsPage(page, pageSize);
        setBrandData(response.records);
        setTotalPages(
          response.meta?.totalPages ||
            Math.ceil(response.records.length / pageSize)
        );
      } catch (err: any) {
        setError(`Не удалось загрузить данные: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadBrands();
  }, [page, pageSize]);

  const handleCreateBrand = async () => {
    try {
      setIsCreating(true);
      await createBrand(newBrandName, newBrandImage);
      setIsCreateModalOpen(false);
      setNewBrandName("");
      setNewBrandImage(null);
      NotificationStore.addNotification(
        "Добавление бренда",
        "Бренд успешно добавлен",
        "success"
      );
    } catch (err: any) {
      setError(`Не удалось создать бренд: ${err.message}`);
      NotificationStore.addNotification(
        "Добавление баннера",
        "Ошибка при создании бренда",
        "error"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const openConfirmModal = (id: string) => {
    setBrandToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (brandToDelete) {
      try {
        await deleteBrand(brandToDelete);
        setBrandData(brandData.filter((brand) => brand.id !== brandToDelete));
        NotificationStore.addNotification(
          "Удаление бренда",
          "Бренд успешно удален",
          "success"
        );
      } catch (err: any) {
        setError(`Не удалось удалить бренд: ${err.message}`);
        NotificationStore.addNotification(
          "Удаление бренда",
          "Ошибка при удалении бренда",
          "error"
        );
      } finally {
        setIsConfirmModalOpen(false);
        setBrandToDelete(null);
      }
    }
  };

  if (loading) return <Skeleton />;
  if (error) return <p>Error: {error}</p>;

  const renderRow = () => {
    return brandData.map((item) => (
      <Table.Tr key={item.id}>
        <Table.Td>{item.id}</Table.Td>
        <Table.Td>
          {item.image?.url ? (
            <img
              src={item.image?.url.replace(
                "http://3.76.32.115:3000",
                "https://rbr.kz"
              )}
              width={80}
            />
          ) : (
            "No Image"
          )}
        </Table.Td>
        <Table.Td>{item.name}</Table.Td>
        <Table.Td>{item.rating}</Table.Td>
        <Table.Td style={{ width: "50px", padding: "0" }}>
          <DeleteIcon onClick={() => openConfirmModal(item.id)} />
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
            Создать бренд
          </BaseButton>
        </div>
        <Table stickyHeader>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Номер</Table.Th>
              <Table.Th>Логотип</Table.Th>
              <Table.Th>Название</Table.Th>
              <Table.Th>Рейтинг</Table.Th>
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
        title="Создать бренд"
      >
        <TextInput
          label="Название бренда"
          value={newBrandName}
          onChange={(event) => setNewBrandName(event.currentTarget.value)}
        />
        <Input
          type="file"
          accept="image/*"
          onChange={(event) => {
            if (event.currentTarget.files?.length) {
              setNewBrandImage(event.currentTarget.files[0]);
            }
          }}
        />
        <Button onClick={handleCreateBrand} loading={isCreating}>
          Создать
        </Button>
      </Modal>

      <Modal
        opened={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Подтвердите удаление"
        withCloseButton={false}
      >
        <p>Вы уверены, что хотите удалить этот бренд?</p>
        <Button style={{ marginRight: "20px" }} onClick={handleConfirmDelete}>
          Удалить
        </Button>
        <Button onClick={() => setIsConfirmModalOpen(false)}>Отмена</Button>
      </Modal>
    </>
  );
};

export default BrandPage;
