// src/components/SecurityPageTable/SecurityPageTable.tsx
import { Button, Checkbox, Modal, Select, Skeleton } from '@mantine/core'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import jsPDF from 'jspdf'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchAllAccounts, deleteAccount, patchAccount } from '@services/AccountsService'
import { BaseButton } from '@shared/ui/Button/BaseButton'
import { Table } from '@shared/ui/Table'
import styles from './UsersTable.module.scss'
import { DeleteIcon } from '@shared/icons'
import NotificationStore from '@features/notification/model/NotificationStore'
import { Pagination } from '@shared/ui/Pagination/Pagination'
import { UserType } from '@shared/types/UserType'

export const UsersTable = () => {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const pageSize = 7
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)

  // === LOAD USERS ===
  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response: any = await fetchAllAccounts()
      const sorted = [...response.data.records].sort((a, b) => b.updatedAt - a.updatedAt)
      setUsers(sorted)
    } catch {
      setError('Не удалось загрузить аккаунты, ошибка сервера')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAccounts()
  }, [loadAccounts])

  const handleStatusChange = async (userId: number, newStatus: 'active' | 'inactive') => {
    try {
      await patchAccount(userId, newStatus)
      setUsers(prev =>
        prev.map(user => (user.id === userId ? { ...user, status: newStatus } : user))
      )
      NotificationStore.addNotification('Успешно', 'Статус обновлен', 'success')
    } catch {
      NotificationStore.addNotification('Ошибка', 'Не удалось обновить статус', 'error')
    }
  }

  const handleDeleteAccount = useCallback(async () => {
    if (!userToDelete) return
    try {
      const res: any = await deleteAccount(userToDelete)
      if (res.status !== 200) throw new Error()

      NotificationStore.addNotification('Успешно', 'Аккаунт удален', 'success')
      setUsers(prev => prev.filter(u => u.id !== userToDelete))
    } catch {
      NotificationStore.addNotification('Ошибка', 'Не удалось удалить аккаунт', 'error')
    } finally {
      setDeleteModalOpen(false)
      setUserToDelete(null)
    }
  }, [userToDelete])

  const confirmDeleteAccount = (id: number) => {
    setUserToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleExport = () => {
    const doc = new jsPDF()
    doc.setFontSize(12)
    users.forEach((u, i) => {
      doc.text(
        `${i + 1}. ${u.firstName} - ${u.role} - ${format(new Date(u.createdAt), 'dd.MM.yy - HH:mm')}`,
        10,
        50 + i * 10
      )
    })
    doc.save('managers_report.pdf')
  }

  // === FILTERED DATA ===
  const filteredUsers = useMemo(() => {
    return users.filter(o => {
      const matchesStatus = statusFilter ? o.status === statusFilter : true
      const search = searchQuery.toLowerCase()

      const matchesSearch = o.firstName?.toString().toLowerCase().includes(search)

      return matchesStatus && (searchQuery ? matchesSearch : true)
    })
  }, [users, statusFilter, searchQuery])

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredUsers.slice(start, start + pageSize)
  }, [filteredUsers, page, pageSize])

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1

  // ===== RENDER =====
  if (loading) return <Skeleton />
  if (error) return <div>{error}</div>

  return (
    <>
      <div className={styles['users-table-head']}>
        <div>
          <input
            type="text"
            placeholder="Поиск"
            onChange={e => {
              setSearchQuery(e.target.value)
              setPage(1) // сброс на первую страницу
            }}
          />
          <Select
            placeholder="Статус"
            data={[
              { value: '', label: 'Все' },
              { value: 'active', label: 'Активный' },
              { value: 'inactive', label: 'Неактивный' },
            ]}
            onChange={value => setStatusFilter(value || null)}
            value={statusFilter || ''}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          <BaseButton onClick={handleExport}>Экспорт</BaseButton>
        </div>
      </div>

      <div className={styles['users-table']}>
        <Table stickyHeader>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Checkbox size="xs" />
              </Table.Th>
              <Table.Th>ID</Table.Th>
              <Table.Th>Пользователь</Table.Th>
              <Table.Th>Статус</Table.Th>
              <Table.Th>Последнее обновление</Table.Th>
              <Table.Th style={{ width: '150px', padding: '0' }}>Действие</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedOrders.map(item => (
              <Table.Tr key={item.id}>
                <Table.Td style={{ width: '16px' }}>
                  <Checkbox size="xs" />
                </Table.Td>
                <Table.Td>{item.id}</Table.Td>
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
            ))}
          </Table.Tbody>
        </Table>
      </div>

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        withCloseButton={false}
        title="Удаление аккаунта"
      >
        <p>Вы уверены, что хотите удалить этот аккаунт?</p>
        <Button onClick={() => setDeleteModalOpen(false)}>Отмена</Button>
        <Button onClick={handleDeleteAccount} color="red">
          Удалить
        </Button>
      </Modal>
    </>
  )
}
