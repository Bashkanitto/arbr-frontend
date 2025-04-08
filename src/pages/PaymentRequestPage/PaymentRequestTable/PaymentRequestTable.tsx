import { Checkbox, Select } from '@mantine/core'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ChangeEvent, useEffect, useState } from 'react'
import { BaseButton } from '@components/atoms/Button/BaseButton'
import { DateItem } from '@components/atoms/DateItem'
import { Table } from '@components/atoms/Table'
import styles from './PaymentRequestTable.module.scss'
import { fetchPaymentRequest, patchPaymentRequest } from '@services/api/logService'
import NotificationStore from '@store/NotificationStore'

export const PaymentRequestTable = () => {
  const [selectRows, setSelectRows] = useState<number[]>([])
  const [paymentRequest, setPaymentRequest] = useState<any>([])
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  useEffect(() => {
    const getRequest = async () => {
      try {
        const response = await fetchPaymentRequest()
        setPaymentRequest(response.data.records)
      } catch (err) {
        console.error(err)
      }
    }

    getRequest()
  }, [])

  const handleStatusChange = async (requestId: number, newStatus: 'active' | 'inactive') => {
    try {
      await patchPaymentRequest(requestId)
      NotificationStore.addNotification(
        'Запрос на вывод',
        `Запрос на вывод ${requestId} успешно изменен`,
        'success'
      )
    } catch (error: any) {
      NotificationStore.addNotification(
        'Запрос на вывод',
        `Произошла ошибка при попытке измененить запрос на вывод`,
        'error'
      )
    }
  }

  const handSelectAllChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    if (checked) {
      setSelectRows(paymentRequest?.map((_: any, index: any) => index))
    } else {
      setSelectRows([])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'false':
        return 'warning'
      case 'true':
        return 'success'
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
    const filteredData = statusFilter
      ? paymentRequest.filter((item: { status: string }) => item.status === statusFilter)
      : paymentRequest

    return filteredData.map((item: any, index: any) => (
      <Table.Tr key={index}>
        <Table.Td>
          <Checkbox
            size="xs"
            checked={selectRows.includes(index)}
            onChange={handleSelectRowChange(index)}
          />
        </Table.Td>
        <Table.Td>{item.id}</Table.Td>
        <Table.Td>{item.balance.account.firstName}</Table.Td>
        <Table.Td>
          <DateItem variantColor={getStatusColor(item.approved.toString())}>
            {item.approved ? 'Подтверждено' : 'Не подтверждено'}
          </DateItem>
        </Table.Td>
        <Table.Td>{`${item.amount}₸`}</Table.Td>
        <Table.Td>{format(item.updatedAt, 'dd MMMM, yyyy', { locale: ru })}</Table.Td>
        {/* // TODO */}
        <Table.Td
          style={{
            textAlign: 'end',
            display: 'flex',
            gap: '5px',
            justifyContent: 'flex-end',
          }}
        >
          <button
            className={styles.statusYesBtn}
            onClick={() => handleStatusChange(item.id, 'active')}
          >
            <img src="/images/like_photo.svg" alt="" />
          </button>
        </Table.Td>
      </Table.Tr>
    ))
  }

  return (
    <>
      <div className={styles['payment-page-table-head']}>
        <div>
          <input type="text" placeholder="Поиск" />
          <Select
            placeholder="Статус"
            data={[
              { value: '', label: 'Все' },
              { value: 'Выиграно', label: 'Выиграно' },
              { value: 'В ожиданий', label: 'В ожиданий' },
              { value: 'Отказано', label: 'Отказано' },
            ]}
            onChange={value => setStatusFilter(value)}
            value={statusFilter || ''}
          />
        </div>
        <BaseButton>Экспорт</BaseButton>
      </div>
      <div className={styles['payment-page-table']}>
        <Table stickyHeader>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Checkbox
                  size="xs"
                  checked={selectRows.length === paymentRequest.length}
                  indeterminate={selectRows.length > 0 && selectRows.length < paymentRequest.length}
                  onChange={handSelectAllChange}
                />
              </Table.Th>
              <Table.Th>ID запроса</Table.Th>
              <Table.Th>Пользователь</Table.Th>
              <Table.Th>Статус</Table.Th>
              <Table.Th>Сумма</Table.Th>
              <Table.Th>Дата</Table.Th>
              <Table.Th style={{ width: '150px', padding: '0' }}>Действие</Table.Th>
            </Table.Tr>
          </Table.Thead>
          {renderRow()}
        </Table>
      </div>
    </>
  )
}
