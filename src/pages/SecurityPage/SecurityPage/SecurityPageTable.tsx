// src/components/SecurityPageTable/SecurityPageTable.tsx
import { Button, Checkbox, Modal, Select, Skeleton } from '@mantine/core'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import jsPDF from 'jspdf'
import { ChangeEvent, useEffect, useState } from 'react'
import { changeAccount, deleteAccount, fetchAllAccounts } from '@services/api/AccountsService'
import { BaseButton } from '@components/atoms/Button/BaseButton'
import { Table } from '@components/atoms/Table'
import { Pagination } from '@components/molecules/Pagination/Pagination'
import styles from './SecurityPageTable.module.scss'
import { DeleteIcon } from '@assets/icons'
import NotificationStore from '@store/NotificationStore'

interface User {
  firstName: string
  id: number
  role: string
  customer: string
  status: 'active' | 'inactive'
  updatedAt: string
  createdAt: string
}

export const SecurityPageTable = () => {
  const [selectRows, setSelectRows] = useState<number[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [userToDelete, setUserToDelete] = useState<number | null>(null)
  const [modals, setModals] = useState({
    deleteModal: false,
    editModal: false,
  })
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [pageSize] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)

  useEffect(() => {
    const loadAccounts = async () => {
      setLoading(true)
      setError(null)
      try {
        const response: any = await fetchAllAccounts(page, pageSize)
        setUsers(response.data.records)
        setTotalPages(response.data.meta.totalPages)
      } catch (err) {
        setError('Failed to load accounts')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadAccounts()
  }, [page, pageSize])

  const handleDeleteAccount = async () => {
    if (!userToDelete) return

    try {
      const response: any = await deleteAccount(userToDelete)

      if (response.status !== 200) {
        throw new Error('Failed to delete account')
      }

      NotificationStore.addNotification('Успешно', 'Аккаунт успешно удален', 'success')

      // Remove user from the list
      setUsers(users.filter(user => user.id !== userToDelete))
    } catch (err) {
      console.error(err)
      NotificationStore.addNotification('Ошибка', 'Произошла ошибка при удалении аккаунта', 'error')
    } finally {
      setModals({ ...modals, deleteModal: false })
      setUserToDelete(null)
    }
  }
  const confirmDeleteAccount = (id: number) => {
    setUserToDelete(id)
    setModals({ ...modals, deleteModal: true })
  }

  const handleStatusChange = async (userId: number, newStatus: 'active' | 'inactive') => {
    try {
      // Отправляем новый статус в API
      const response = await changeAccount(userId, newStatus)
      if (response.error) {
        throw new Error('Failed to update status')
      }

      // Обновляем статус в локальном состоянии
      setUsers(prevUsers =>
        prevUsers.map(user => (user.id === userId ? { ...user, status: newStatus } : user))
      )

      NotificationStore.addNotification('Успешно', 'Статус обновлен', 'success')
    } catch (error) {
      console.error(error)
      NotificationStore.addNotification('Ошибка', 'Не удалось обновить статус', 'error')
    }
  }

  if (loading) return <Skeleton />
  if (error) return <div>Error: {error}</div>

  const handleExport = () => {
    const doc = new jsPDF()
    doc.setFontSize(12)
    users.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.firstName} - ${item.role} - ${format(
          new Date(item.createdAt),
          'dd.MM.yy - HH:mm'
        )}`,
        10,
        50 + index * 10
      )
    })
    doc.save('managers_report.pdf')
  }

  const handleSelectAllChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    if (checked) {
      setSelectRows(users.map(item => item.id))
    } else {
      setSelectRows([])
    }
  }

  const handleSelectRowChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    if (checked) {
      setSelectRows([...selectRows, index])
    } else {
      setSelectRows(selectRows.filter(item => item !== index))
    }
  }

  const renderRow = () => {
    const filteredData = statusFilter ? users.filter(item => item.status === statusFilter) : users

    return filteredData.map(item => (
      <Table.Tr key={item.id}>
        <Table.Td style={{ width: '16px' }}>
          <Checkbox
            size="xs"
            checked={selectRows.includes(item.id)}
            onChange={handleSelectRowChange(item.id)}
          />
        </Table.Td>
        <Table.Td>{item.firstName}</Table.Td>
        <Table.Td>
          <Select
            data={[
              { value: 'active', label: 'Активный' },
              { value: 'inactive', label: 'Неактивный' },
            ]}
            value={item.status}
            onChange={value => handleStatusChange(item.id, value as 'active' | 'inactive')}
            size="xs"
            style={{ width: '120px' }}
          />
        </Table.Td>
        <Table.Td>{format(item.updatedAt, 'dd MMMM, yyyy', { locale: ru })}</Table.Td>
        <Table.Td style={{ width: '50px', padding: '0' }}>
          <DeleteIcon onClick={() => confirmDeleteAccount(item.id)} />
        </Table.Td>
      </Table.Tr>
    ))
  }

  return (
    <>
      <div className={styles['security-page-table-head']}>
        <div>
          <input type="text" placeholder="Поиск" />
          <Select
            placeholder="Статус"
            data={[
              { value: '', label: 'Все' },
              { value: 'Создано', label: 'Создано' },
              { value: 'Подтверждено', label: 'Подтверждено' },
            ]}
            onChange={value => setStatusFilter(value)}
            value={statusFilter || ''}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={newPage => setPage(newPage)}
          />
          <BaseButton onClick={handleExport}>Экспорт</BaseButton>
        </div>
      </div>
      <div className={styles['security-page-table']}>
        <Table stickyHeader>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Checkbox
                  size="xs"
                  checked={selectRows.length === users.length}
                  indeterminate={selectRows.length > 0 && selectRows.length < users.length}
                  onChange={handleSelectAllChange}
                />
              </Table.Th>
              <Table.Th>Пользователь</Table.Th>
              <Table.Th>Статус</Table.Th>
              <Table.Th>Последнее обновление</Table.Th>
              <Table.Th style={{ width: '150px', padding: '0' }}>Действие</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{renderRow()}</Table.Tbody>
        </Table>
      </div>

      <Modal
        opened={modals.deleteModal}
        onClose={() => setModals({ ...modals, deleteModal: false })}
        withCloseButton={false}
        title="Удаление аккаунта"
      >
        <p>Вы уверены, что хотите удалить этот аккаунт?</p>
        <Button onClick={() => setModals({ ...modals, deleteModal: false })}>Отмена</Button>
        <Button onClick={handleDeleteAccount} color="red">
          Удалить
        </Button>
      </Modal>
    </>
  )
}
