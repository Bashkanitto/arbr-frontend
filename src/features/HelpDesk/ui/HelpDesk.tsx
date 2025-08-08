import { useState } from 'react'
import baseApi from '@services/base'
import { Button, Modal } from '@mantine/core'
import { wait } from '@shared/utils/wait'
import NotificationStore from '@features/notification/model/NotificationStore'
import { helpDeskStore } from '../model/HelpDeskStore'

const HelpDeskModal: React.FC = () => {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<string | null>(null)

  const sendMessage = async () => {
    if (!message.trim()) return

    setLoading(true)
    try {
      await baseApi.post('/service-desk/send-message', {
        message,
      })

      setSuccess('Сообщение отправлено!')
      setMessage('')
      NotificationStore.addNotification(
        'Отправка сообщении',
        'Сообщение отправлено успешно!',
        'success'
      )
    } catch (error) {
      setSuccess('Ошибка при отправке')
      console.error('Ошибка:', error)
      NotificationStore.addNotification(
        'Отправка сообщении',
        'Ошибка при отправлении сообщении!',
        'error'
      )
    } finally {
      wait(2000).then(() => {
        setSuccess(null)
        helpDeskStore.close()
      })
    }
    setLoading(false)
  }

  return (
    <Modal
      opened={helpDeskStore.isOpen}
      onClose={() => helpDeskStore.close()}
      title="Нужна помощь? Свяжитесь с нами"
    >
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Опишите вашу проблему здесь..."
        rows={4}
        style={{
          outline: 'none',
          width: '100%',
          padding: '8px',
          marginBottom: '10px',
          whiteSpace: 'pre-wrap', // 🔥 Добавляем поддержку пробелов и переносов строк
          wordWrap: 'break-word',
        }}
      />
      <Button
        onClick={sendMessage}
        disabled={loading}
        style={{
          width: '100%',
        }}
      >
        {loading ? 'Отправка...' : 'Отправить'}
      </Button>
      {success && (
        <p
          style={{
            marginTop: '10px',
            color: 'red',
          }}
        >
          {success}
        </p>
      )}
    </Modal>
  )
}

export default HelpDeskModal
