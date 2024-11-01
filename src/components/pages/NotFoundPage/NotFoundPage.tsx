import { useNavigate } from 'react-router-dom'
import styles from './NotFoundPage.module.scss'

const NotFoundPage = () => {
	const navigate = useNavigate()

	const handleBack = () => {
		navigate(-1)
	}

	return (
		<div className={styles['notfound-page']}>
			<p>Страница в разработке, покажем совсем скоро</p>
			<button onClick={handleBack}>Вернуться</button>
		</div>
	)
}

export default NotFoundPage
