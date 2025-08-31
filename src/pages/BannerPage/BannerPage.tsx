/* eslint-disable @typescript-eslint/no-explicit-any */
import { Skeleton, Table, Button, Modal, TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'
import styles from './BannerPage.module.scss'
import { fetchFeatures, deleteBanner, createBanner } from '@services/brandService'
import { BaseButton } from '@shared/ui/Button/BaseButton'
import NotificationStore from '@features/notification/model/NotificationStore'
import { DeleteIcon } from '../../shared/icons'
import { ContentLayout } from '@components/layouts/ContentLayout'
import { ContentTopBar } from '@components/layouts/ContentTopBar'
import { ContentUserInfo } from '@components/layouts/ContentUserInfo'
import { wait } from '@shared/utils/wait'
import { Pagination } from '@shared/ui/Pagination/Pagination'

const BannerPage = () => {
  const [bannerData, setBannerData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
  const [brandId, setBrandId] = useState<string>('')
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize] = useState<number>(10)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false)
  const [totalPages, setTotalPages] = useState<number>(1)

  useEffect(() => {
    const loadBanners = async () => {
      try {
        setLoading(true)
        const response: any = await fetchFeatures(page, pageSize)
        setTotalPages(
          response.data.meta?.totalPages || Math.ceil(response.data.records.length / pageSize)
        )
        setBannerData(response.data.records)
      } catch (err: any) {
        setError(`Не удалось загрузить данные: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }
    loadBanners()
  }, [page, pageSize])

  const handleCreateBanner = async () => {
    try {
      const numericBrandId = Number(brandId)
      if (!brandId.trim()) {
        setError('Введите корректный номер бренда')
        return
      }
      setIsCreating(true)

      await createBanner(numericBrandId, page, pageSize)

      setIsCreateModalOpen(false)
      setBrandId('')
      wait(1000)
      // window.location.reload()

      NotificationStore.addNotification('Добавление баннера', 'Баннер успешно создан', 'success')
    } catch (err: any) {
      console.log(`Не удалось создать баннер: ${err}`)
      NotificationStore.addNotification('Добавление баннера', `${err.message}`, 'error')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteBanner = async (id: string) => {
    try {
      const response: any = await deleteBanner(id)
      if (response.data.createdAt) {
        setBannerData(bannerData.filter(banner => banner.id !== id))
      } else {
        NotificationStore.addNotification(
          'Удаление баннера',
          'Ошибка при удалении баннера',
          'error'
        )
      }
    } catch (err: any) {
      setError(`Не удалось удалить баннер: ${err.message}`)
    } finally {
      setIsConfirmModalOpen(false)
    }
  }

  if (loading) return <Skeleton />

  const renderRow = () => {
    return bannerData.map(item => (
      <Table.Tr key={item.id}>
        <Table.Td>{item.id}</Table.Td>
        <Table.Td>{item.brand.name}</Table.Td>
        <Table.Td>{item.brand.features?.discount}</Table.Td>
        <Table.Td style={{ width: '50px', padding: '0' }}>
          <DeleteIcon
            onClick={() => {
              setIsConfirmModalOpen(true)
              setBrandId(item.id)
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
          <ContentTopBar title="Баннеры" />
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
            <BaseButton onClick={() => setIsCreateModalOpen(true)}>Создать Баннер</BaseButton>
          </div>
          <Table stickyHeader>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Номер</Table.Th>
                <Table.Th>Название Бренда</Table.Th>
                <Table.Th>Скидки</Table.Th>
                <Table.Th style={{ width: '150px', padding: '0' }}>Действие</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{renderRow()}</Table.Tbody>
          </Table>
        </div>

        {/* подтверждение удаления */}
        <Modal
          opened={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          title="Подтвердите удаление"
          withCloseButton={false}
        >
          <p>Вы уверены, что хотите удалить этот бренд?</p>
          <Button style={{ marginRight: '20px' }} onClick={() => handleDeleteBanner(brandId)}>
            Удалить
          </Button>
          <Button onClick={() => setIsConfirmModalOpen(false)}>Отмена</Button>
        </Modal>

        {/* добавление баннера */}
        <Modal
          opened={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Добавить Баннер"
        >
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <TextInput
            type="number"
            label="Номер Бренда"
            value={brandId}
            onChange={event => setBrandId(event.target.value)}
          />
          <Button style={{ marginTop: '20px' }} onClick={handleCreateBanner} loading={isCreating}>
            Добавить
          </Button>
        </Modal>
      </div>
    </ContentLayout>
  )
}

export default BannerPage
