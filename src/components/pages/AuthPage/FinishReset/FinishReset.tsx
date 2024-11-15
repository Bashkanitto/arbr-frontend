import { Input } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { FormEvent, useState } from 'react'
import { BaseButton } from '../../../atoms/Button/BaseButton'
import styles from '../PasswordReset/PasswordReset.module.scss'

interface PasswordResetProps {
	onNext: () => void
	onBack: () => void
}

const FinishPassword = observer(({ onNext, onBack }: PasswordResetProps) => {
	const [code, setCode] = useState(true)
	const handleReset = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		// Логика сброса пароля
		console.log('Сброс пароля')
	}

	return (
		<form className={styles.resetForm} onSubmit={handleReset}>
			<div>
				<h4>
					Введите новый пароль <button onClick={onBack}>Назад</button>
				</h4>
				<p>Введите код, который мы вам отправили на ваш адрес</p>
			</div>
			<div>
				<Input
					onChange={() => setCode(false)}
					name='email'
					placeholder='Введите пароль'
					required
				/>
				<Input
					onChange={() => setCode(false)}
					name='email'
					placeholder='Подтвердите пароль'
					required
				/>
				<BaseButton
					disabled={code}
					onClick={onNext}
					type='submit'
					variantColor='primary'
				>
					Войти
				</BaseButton>
			</div>
		</form>
	)
})

export default FinishPassword
