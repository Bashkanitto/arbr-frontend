/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { FormEvent, useState } from 'react'
import { updatePassword } from '@services/authService'
import { BaseButton } from '@shared/ui/Button/BaseButton'
import styles from '../PasswordReset/PasswordReset.module.scss'

interface PasswordResetProps {
  onNext: () => void
  onBack: () => void
}

const FinishPassword = observer(({ onNext, onBack }: PasswordResetProps) => {
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    setLoading(true)

    try {
      await updatePassword(password) // Вызываем API
      onNext() // Переходим дальше только при успешном запросе
    } catch (error: any) {
      setError(error.message || 'Произошла ошибка.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.resetForm} onSubmit={handleConfirm}>
      <div>
        <h4>
          Введите новый пароль{' '}
          <button type="button" onClick={onBack}>
            Назад
          </button>
        </h4>
        <p>Введите новый пароль</p>
      </div>
      <div>
        {error && (
          <p style={{ margin: 0 }} className={styles.error}>
            {error}
          </p>
        )}
        <Input
          onChange={e => setPassword(e.target.value)}
          value={password}
          name="password"
          placeholder="Введите пароль"
          required
        />
        <Input
          onChange={e => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          name="confirmPassword"
          placeholder="Подтвердите пароль"
          required
        />
        <BaseButton
          disabled={loading || !password || !confirmPassword}
          type="submit"
          variantColor="primary"
        >
          {loading ? 'Обновление...' : 'Подтвердить'}
        </BaseButton>
      </div>
    </form>
  )
})

export default FinishPassword
