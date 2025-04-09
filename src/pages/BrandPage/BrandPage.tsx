/* eslint-disable @typescript-eslint/no-explicit-any */
import { Skeleton, Table, Button, Modal, TextInput, Input } from '@mantine/core'
import { Pagination } from '@components/molecules/Pagination/Pagination'
import { useEffect, useState } from 'react'
import styles from './BrandPage.module.scss'
import { createBrand, deleteBrand, editBrand, fetchBrandsPage } from '@services/api/brandService'
import { BaseButton } from '@components/atoms/Button/BaseButton'
import NotificationStore from '@store/NotificationStore'
import { DeleteIcon, EditIcon } from '@assets/icons'
import { ContentLayout } from '@components/layouts/ContentLayout'
import { ContentTopBar } from '@components/layouts/ContentTopBar'
import { ContentUserInfo } from '@components/layouts/ContentUserInfo'

interface Brand {
  id: string
  name: string
  image: any
  rating: number
  createdAt: string
  status: 'active' | 'inactive'
}

const BrandPage = () => {
  const [brandData, setBrandData] = useState<Brand[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [newBrandName, setNewBrandName] = useState<string>('')
  const [brand, setBrand] = useState<any>()
  const [brandFilename, setBrandFilename] = useState<string>('')
  const [newBrandImage, setNewBrandImage] = useState<File | null>(null)
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false)
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [pageSize] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)

  // загрузка брендов
  useEffect(() => {
    const loadBrands = async () => {
      try {
        setLoading(true)
        const response: any = await fetchBrandsPage(page, pageSize)
        setBrandData(response.data.records)
        setTotalPages(
          response.data.meta?.totalPages || Math.ceil(response.data.records.length / pageSize)
        )
      } catch (err: any) {
        setError(`Не удалось загрузить данные: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }
    loadBrands()
  }, [page, pageSize])

  // Создание бренда
  const handleCreateBrand = async () => {
    setErrorText(null)

    if (!newBrandName) {
      setErrorText('Заполните поля')
    } else {
      try {
        setIsCreating(true)
        await createBrand(newBrandName, newBrandImage)
        setIsCreateModalOpen(false)
        setNewBrandName('')
        setNewBrandImage(null)
        NotificationStore.addNotification('Добавление бренда', 'Бренд успешно добавлен', 'success')
      } catch (err: any) {
        setError(`Не удалось создать бренд: ${err.message}`)
        NotificationStore.addNotification(
          'Добавление бренда',
          'Ошибка при создании бренда',
          'error'
        )
      } finally {
        setIsCreating(false)
      }
    }
  }
  // изменение брендов
  const handleEditBrand = async () => {
    setEditModalOpen(true)
    setErrorText(null)

    if (!newBrandName) {
      setErrorText('Заполните поля')
    } else {
      try {
        const response = await editBrand(brand.id, newBrandName, newBrandImage, brandFilename)

        console.log(brand)
        setBrandData(prev => prev.map(item => (item.id === brand.id ? response.data : item)))
        setEditModalOpen(false)
        NotificationStore.addNotification('Изменение бренда', 'Бренд успешно изменен', 'success')
      } catch (err: any) {
        setError(`Не удалось создать бренд: ${err.message}`)
        NotificationStore.addNotification(
          'Изменение бренда',
          'Ошибка при изменении бренда',
          'error'
        )
      }
    }
  }

  const openConfirmModal = (id: string) => {
    setBrandToDelete(id)
    setIsConfirmModalOpen(true)
  }

  // подтверждение удаления
  const handleConfirmDelete = async () => {
    if (brandToDelete) {
      try {
        await deleteBrand(brandToDelete)
        setBrandData(brandData.filter(brand => brand.id !== brandToDelete))
        NotificationStore.addNotification('Удаление бренда', 'Бренд успешно удален', 'success')
      } catch (err: any) {
        setError(`Не удалось удалить бренд: ${err.message}`)
        NotificationStore.addNotification('Удаление бренда', 'Ошибка при удалении бренда', 'error')
      } finally {
        setIsConfirmModalOpen(false)
        setBrandToDelete(null)
      }
    }
  }

  if (loading) return <Skeleton />
  if (error) return <p>Error: {error}</p>

  const renderRow = () => {
    return brandData.map(item => (
      <Table.Tr key={item.id}>
        <Table.Td>{item.id}</Table.Td>
        <Table.Td>
          {item.image && item.image[0]?.url ? (
            <img
              src={item.image[0]?.url.replace('http://3.76.32.115:3000', 'https://api.arbr.kz')}
              width={80}
            />
          ) : (
            <p style={{ color: 'grey' }}>Нет лого</p>
          )}
        </Table.Td>
        <Table.Td>{item.name}</Table.Td>
        <Table.Td>{item.rating}</Table.Td>
        <Table.Td style={{ width: '50px', padding: '0' }}>
          <DeleteIcon onClick={() => openConfirmModal(item.id)} />
          <EditIcon
            onClick={() => {
              setEditModalOpen(true)
              setBrandFilename(item.image.length > 0 ? item.image[0].filename : '')
              setBrand(item)
            }}
          />
        </Table.Td>
      </Table.Tr>
    ))
  }

  return (
    <ContentLayout
      className={styles['withdraws-page']}
      header={
        <>
          <ContentTopBar title="Бренды" />
          <ContentUserInfo />
        </>
      }
    >
      <div>
        <div className={styles['security-page-table']}>
          <div className={styles['security-page-table-head']}>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={newPage => setPage(newPage)}
            />
            <BaseButton onClick={() => setIsCreateModalOpen(true)}>Создать бренд</BaseButton>
          </div>
          <Table stickyHeader>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Номер</Table.Th>
                <Table.Th>Логотип</Table.Th>
                <Table.Th>Название</Table.Th>
                <Table.Th>Рейтинг</Table.Th>
                <Table.Th style={{ width: '150px', padding: '0' }}>Действие</Table.Th>
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
            onChange={event => setNewBrandName(event.currentTarget.value)}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={event => {
              if (event.currentTarget.files?.length) {
                setNewBrandImage(event.currentTarget.files[0])
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
          withCloseButton={false}
        >
          <p style={{ margin: '20px 0' }}>Вы уверены, что хотите удалить этот бренд?</p>
          <Button style={{ marginRight: '20px' }} onClick={handleConfirmDelete}>
            Удалить
          </Button>
          <Button onClick={() => setIsConfirmModalOpen(false)}>Отмена</Button>
        </Modal>

        <Modal
          opened={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          withCloseButton={false}
        >
          <label htmlFor="brandName">Новые название</label>
          <TextInput
            id="brandName"
            value={newBrandName}
            onChange={event => setNewBrandName(event.currentTarget.value)}
            style={{ margin: '0 0 10px 0 ' }}
          />
          <label htmlFor="brandLogo">Новый логотип</label>
          <Input
            id="brandLogo"
            type="file"
            accept="image/*"
            style={{ margin: '0 0 10px 0 ' }}
            onChange={event => {
              if (event.currentTarget.files?.length) {
                setNewBrandImage(event.currentTarget.files[0])
              }
            }}
          />
          <Button onClick={() => handleEditBrand()}>Изменить</Button>
          {errorText && <p style={{ color: 'red' }}>{errorText}</p>}
        </Modal>
      </div>
    </ContentLayout>
  )
}

export default BrandPage
