/* eslint-disable @typescript-eslint/no-unused-vars */
import { Input } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { FormEvent, useState } from 'react'
import { sendOtpResetPassword } from '@services/authService.js'
import { BaseButton } from '@shared/ui/Button/BaseButton'
import styles from './PasswordReset.module.scss'

interface PasswordResetProps {
  onNext: () => void
  onBack: () => void
}

const PasswordReset = observer(({ onNext, onBack }: PasswordResetProps) => {
  const [email, setEmail] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await sendOtpResetPassword(email)
      onNext()
    } catch (err) {
      setError('Не удалось отправить код. Проверьте адрес почты.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.resetForm} onSubmit={handleReset}>
      <div>
        <h4>
          Сброс пароля{' '}
          <button type="button" onClick={onBack}>
            Назад
          </button>
        </h4>
        <p>
          Введите адрес, на который мы вам
          <br />
          отправим код .
        </p>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div>
        <Input
          onChange={e => setEmail(e.target.value)}
          value={email}
          name="email"
          placeholder="Ваша почта"
          required
        />
        <BaseButton disabled={loading || !email} type="submit" variantColor="primary">
          {loading ? 'Отправка...' : 'Отправить код'}
        </BaseButton>
      </div>
    </form>
  )
})

export default PasswordReset
