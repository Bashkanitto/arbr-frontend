import { Input } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { FormEvent } from 'react'
import { BaseButton } from '../../../atoms/Button/BaseButton'
import styles from './PasswordReset.module.scss'

const PasswordReset = observer(() => {
	const handleReset = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		// Логика сброса пароля
		console.log('Сброс пароля')
	}

	return (
		<form className={styles.resetForm} onSubmit={handleReset}>
			<div>
				<h4>Сброс пароля</h4>
				<p>
					Введите адрес, на который мы вам
					<br />
					отправим код .
				</p>
			</div>
			<div>
				<Input name='email' placeholder='Ваша почта' required />
				<BaseButton type='submit' variantColor='primary'>
					Отправить код
				</BaseButton>
			</div>
		</form>
	)
})

export default PasswordReset
