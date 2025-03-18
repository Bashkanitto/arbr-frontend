/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Skeleton,
  Table,
  Button,
  Modal,
  TextInput,
  Input,
} from "@mantine/core";
import { Pagination } from "@components/molecules/Pagination/Pagination";
import { useEffect, useState } from "react";
import styles from "./BrandPage.module.scss";
import {
  createBrand,
  deleteBrand,
  editBrand,
  fetchBrandsPage,
} from "@services/api/brandService";
import { BaseButton } from "@components/atoms/Button/BaseButton";
import NotificationStore from "@store/NotificationStore";
import { DeleteIcon, EditIcon } from "@assets/icons";

interface Brand {
  id: string;
  name: string;
  image?: Array<{
    url: string;
    filename: string;
  }>;
  rating: number;
  createdAt: string;
  status: "active" | "inactive";
}

const BrandPage = () => {
  const [brandData, setBrandData] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [newBrandName, setNewBrandName] = useState<string>("");
  const [brandId, setBrandId] = useState<string>("");
  const [brandFilename, setBrandFilename] = useState<string>("");
  const [newDiscount, setNewDiscount] = useState<string | number>();
  const [newBonus, setNewBonus] = useState<string | number>();
  const [newBrandImage, setNewBrandImage] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  // загрузка брендов
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

  // Создание бренда
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
        "Добавление бренда",
        "Ошибка при создании бренда",
        "error"
      );
    } finally {
      setIsCreating(false);
    }
  };

  // изменение брендов
  const handleEditBrand = async () => {
    setEditModalOpen(true);

    try {
      await editBrand(
        brandId,
        newBrandName,
        newBrandImage,
        brandFilename,
        Number(newDiscount),
        Number(newBonus)
      );
      setEditModalOpen(false);
      NotificationStore.addNotification(
        "Изменение бренда",
        "Бренд успешно изменен",
        "success"
      );
    } catch (err: any) {
      setError(`Не удалось создать бренд: ${err.message}`);
      NotificationStore.addNotification(
        "Изменение бренда",
        "Ошибка при изменении бренда",
        "error"
      );
    } finally {
      setEditModalOpen(false);
    }
  };

  const openConfirmModal = (id: string) => {
    setBrandToDelete(id);
    setIsConfirmModalOpen(true);
  };

  // подтверждение удаления
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
          {item.image && item.image[0]?.url ? (
            <img
              src={item.image[0].url.replace(
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
          <EditIcon
            onClick={() => {
              setEditModalOpen(true);
              setBrandFilename((item.image && item.image[0].filename) || "");
              setBrandId(item.id);
            }}
          />
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

      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Изменить бренд"
        withCloseButton={false}
      >
        <TextInput
          label="Новое название"
          value={newBrandName}
          onChange={(event) => setNewBrandName(event.currentTarget.value)}
        />
        <TextInput
          label="Изменить Скидку"
          value={newDiscount}
          onChange={(event) => setNewDiscount(event.currentTarget.value)}
        />
        <TextInput
          label="Изменить бонус"
          value={newBonus}
          onChange={(event) => setNewBonus(event.currentTarget.value)}
        />
        <Input
          type="file"
          aria-label="Изменить логотип"
          accept="image/*"
          onChange={(event) => {
            if (event.currentTarget.files?.length) {
              setNewBrandImage(event.currentTarget.files[0]);
            }
          }}
        />
        <Button onClick={() => handleEditBrand()}>Изменить</Button>
      </Modal>
    </>
  );
};

export default BrandPage;
