import { Skeleton, Table } from '@mantine/core'
import { fetchLogger } from '@services/logService'
import { useEffect, useState } from 'react'
import styles from './LogsTable.module.scss'

const LogsTable = () => {
  const [loggerData, setLoggerData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadLoggers = async () => {
      setLoading(true)
      setError(null)

      try {
        const response: any = await fetchLogger()
        const parsedLogs = parseLogs(response.data)
        setLoggerData(parsedLogs) // ✅ Исправлено
      } catch (err: any) {
        setError(`Не удалось загрузить данные: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    loadLoggers()
  }, [])

  const parseLogs = (logText: string) => {
    const logEntries = logText.split(/\[ERROR\]/).filter(entry => entry.trim()) // Разбиваем по [ERROR]

    return logEntries
      .map(entry => {
        try {
          const jsonPart = entry.substring(entry.indexOf('{')) // Берем JSON-часть
          return JSON.parse(jsonPart)
        } catch (error) {
          console.error('Ошибка парсинга:', error)
          return null
        }
      })
      .filter(Boolean) // Убираем null-значения
  }

  if (loading) return <Skeleton />
  if (error) return `Ошибка: ${error}`

  return (
    <div style={{ background: 'white', borderRadius: '30px' }}>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Статус</Table.Th>
            <Table.Th>Время</Table.Th>
            <Table.Th>Метод</Table.Th>
            <Table.Th>URL</Table.Th>
            <Table.Th>Статус</Table.Th>
            <Table.Th>Сообщение</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {loggerData?.map(
            (
              log,
              index // ✅ Добавил проверку
            ) => (
              <Table.Tr key={index}>
                <Table.Th>
                  <div
                    style={{ background: log.status == 404 ? 'red' : 'green' }}
                    className={styles.status}
                  ></div>
                </Table.Th>
                <Table.Th>{log.timestamp}</Table.Th>
                <Table.Th>{log.method}</Table.Th>
                <Table.Th style={{ maxWidth: '500px' }}>{log.url}</Table.Th>
                <Table.Th>{log.status}</Table.Th>
                <Table.Th style={{ maxWidth: '200px', overflowX: 'scroll' }}>
                  {log.responseBody?.error?.message || 'Нет данных'}
                </Table.Th>
              </Table.Tr>
            )
          )}
        </Table.Tbody>
      </Table>
    </div>
  )
}

export default LogsTable
