/* eslint-disable @typescript-eslint/no-unused-vars */
import { Input } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { FormEvent, useState } from 'react'
import { confirmOtpResetPassword } from '@services/authService.js'
import { BaseButton } from '@shared/ui/Button/BaseButton'
import styles from '../PasswordReset/PasswordReset.module.scss'

interface PasswordResetProps {
  onNext: () => void
  onBack: () => void
}

const GetCode = observer(({ onNext, onBack }: PasswordResetProps) => {
  const [otpCode, setOtpCode] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await confirmOtpResetPassword(otpCode)
      onNext() // Переход на следующий шаг
    } catch (error) {
      setError('Неправильный код или истекшая сессия.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <form className={styles.resetForm} onSubmit={handleConfirm}>
      <div>
        <h4>
          Введите код{' '}
          <button type="button" onClick={onBack}>
            Назад
          </button>
        </h4>
        <p>Введите код, который мы вам отправили на ваш адрес</p>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div>
        <Input
          onChange={e => setOtpCode(e.target.value)}
          value={otpCode}
          name="otp"
          placeholder="Введите код"
          required
        />
        <BaseButton disabled={loading} type="submit" variantColor="primary">
          {loading ? 'Проверка...' : 'Подтвердить'}
        </BaseButton>
      </div>
    </form>
  )
})

export default GetCode
