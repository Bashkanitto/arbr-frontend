import { useLocation, useNavigate } from 'react-router-dom'
import { BaseButton } from '../../../atoms/Button/BaseButton'
import styles from './CatalogSwitch.module.scss'

const CatalogSwitch = () => {
	const navigate = useNavigate()
	const location = useLocation()

	const isCatalogPage = location.pathname === '/catalog'
	const isSearchPage = location.pathname === '/search'

	return (
		<div className={styles['catalog-switch']}>
			<BaseButton
				onClick={() => navigate('/catalog')}
				variantColor={isCatalogPage ? 'primary' : 'secondary'}
			>
				Лучшие
			</BaseButton>
			<BaseButton
				onClick={() => navigate('/search')}
				variantColor={isSearchPage ? 'primary' : 'secondary'}
			>
				Поиск
			</BaseButton>
		</div>
	)
}

export default CatalogSwitch
