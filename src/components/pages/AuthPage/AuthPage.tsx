import { Input } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authStore from '../../../store/AuthStore'
import { BaseButton } from '../../atoms/Button/BaseButton'
import styles from './AuthPage.module.scss'
import Footer from './Footer/Footer'
import PasswordReset from './PasswordReset/PasswordReset'

const AuthPage = observer(() => {
	const navigate = useNavigate()
	const [error, setError] = useState<string | null>(null)
	const [isResetMode, setIsResetMode] = useState(false)

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setError(null)

		const identifier = (event.target as HTMLFormElement).identifier.value
		const password = (event.target as HTMLFormElement).password.value

		try {
			await authStore.login(identifier, password)
			if (authStore.isLoggedIn) {
				navigate('/managers')
			} else {
				setError('Не удалось войти, проверьте данные')
			}
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error: unknown) {
			setError('Ошибка: Неправильные данные для входа') // обработка ошибки
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.formWrapper}>
				<div
					className={styles.formScroller}
					style={{
						transform: isResetMode ? 'translateX(-480px)' : 'translateX(0)',
					}}
				>
					<form className={styles.authForm} onSubmit={e => handleSubmit(e)}>
						<h4>Авторизация</h4>
						<p>Введите ваш номер телефона для входа в личный кабинет.</p>
						{error && <p className={styles.error}>{error}</p>}

						<Input
							className={styles['inputs']}
							name='identifier'
							placeholder='Ваша Почта'
						/>
						<Input
							className={styles['inputs']}
							name='password'
							placeholder='Ваш Пароль'
						/>
						<a
							onClick={() => setIsResetMode(true)}
							className={styles.forgetPassword}
						>
							Забыли пароль?
						</a>
						<BaseButton type='submit' variantColor='primary'>
							{authStore.loading ? 'Вход...' : 'Войти'}
						</BaseButton>

						{/* Отображение сообщения об ошибке */}
					</form>
					<PasswordReset />
				</div>
			</div>
			<Footer />
		</div>
	)
})

export default AuthPage
