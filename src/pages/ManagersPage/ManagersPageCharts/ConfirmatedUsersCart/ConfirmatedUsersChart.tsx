import { Table } from '@components/atoms/Table'
import styles from './ConfirmatedUsersChart.module.scss'
import { useEffect, useState } from 'react'
import { fetchLogger } from '@services/api/logService'

const elements = [
  {
    fullName: 'Родриго Гоес',
    role: 'Менеджер',
    status: 'Подтверждено',
    profileLink: '#',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    fullName: 'Виктор Галкин',
    role: 'Менеджер',
    status: 'Подтверждено',
    profileLink: '#',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    fullName: 'Оскар Мальгасов',
    role: 'Менеджер',
    status: 'Подтверждено',
    profileLink: '#',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    fullName: 'Чириштиано Роналдо',
    role: 'Менеджер',
    status: 'Подтверждено',
    profileLink: '#',
    avatar: 'https://via.placeholder.com/50',
  },
]

const ConfirmatedUsersChart = () => {
  const [loggerData, setLoggerData] = useState()
  const [totalPages, setTotalPages] = useState()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadLoggers = async () => {
      try {
        setLoading(true)
        const response: any = await fetchLogger()
        setLoggerData(response.records)
      } catch (err: any) {
        setError(`Не удалось загрузить данные: ${err.message}`)
      } finally {
        setLoading(false)
        setError(null)
      }
    }
    loadLoggers()
  }, [])

  return (
    <div className={styles.container}>
      <h3 style={{ fontSize: '18px' }}>Логи</h3>
      <Table stickyHeader>
        <Table.Tbody>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{loggerData}</pre>
        </Table.Tbody>
      </Table>
    </div>
  )
}

export default ConfirmatedUsersChart
