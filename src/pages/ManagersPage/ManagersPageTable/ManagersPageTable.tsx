import { EllipsisVerticalIcon } from '@heroicons/react/16/solid'
import { Checkbox } from '@mantine/core'
import { format } from 'date-fns'
import { ChangeEvent, useState } from 'react'
import { DateItem } from '@shared/ui/DateItem'
import { Table } from '@shared/ui/Table'
import styles from './ManagersPageTable.module.scss'

const elements = [
  {
    fullName: 'Иванов Иван',
    updateAt: new Date(),
    createdAt: new Date(),
    region: 'Урал',
    archive: true,
    active: true,
    profile: 'admin',
  },
  {
    fullName: 'Иванов Иван',
    updateAt: new Date(),
    createdAt: new Date(),
    region: 'Урал',
    archive: true,
    active: true,
    profile: 'admin',
  },
]

export const ManagersPageTable = () => {
  const [selectRows, setSelectRows] = useState<number[]>([])

  const handSelectAllChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    if (checked) {
      setSelectRows(elements.map((_, index) => index))
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
    return elements.map((item, index) => (
      <Table.Tr key={index}>
        <Table.Td>
          <Checkbox
            size="xs"
            checked={selectRows.includes(index)}
            onChange={handleSelectRowChange(index)}
          />
        </Table.Td>
        <Table.Td>{item.fullName}</Table.Td>
        <Table.Td>
          <DateItem variantColor="gray">{format(item.updateAt, 'dd.MM.yyyy-HH:mm')}</DateItem>
        </Table.Td>
        <Table.Td>
          <DateItem variantColor="secondary">{format(item.createdAt, 'dd.MM.yyyy-HH:mm')}</DateItem>
        </Table.Td>
        <Table.Td>{item.region}</Table.Td>
        <Table.Td>{item.archive ? 'Да' : 'Нет'}</Table.Td>
        <Table.Td>{item.active ? 'Да' : 'Нет'}</Table.Td>
        <Table.Td>{item.profile}</Table.Td>
        <Table.Td>
          <EllipsisVerticalIcon />
        </Table.Td>
      </Table.Tr>
    ))
  }

  return (
    <div className={styles['managers-page-table']}>
      <Table stickyHeader>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Checkbox
                size="xs"
                checked={selectRows.length === elements.length}
                indeterminate={selectRows.length > 0 && selectRows.length < elements.length}
                onChange={handSelectAllChange}
              />
            </Table.Th>
            <Table.Th>ФИО</Table.Th>
            <Table.Th>Записано</Table.Th>
            <Table.Th>Создано</Table.Th>
            <Table.Th>Регион</Table.Th>
            <Table.Th>В архиве</Table.Th>
            <Table.Th>Активен</Table.Th>
            <Table.Th>Профиль</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        {renderRow()}
      </Table>
    </div>
  )
}
