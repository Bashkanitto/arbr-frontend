import { BaseButton } from '../../../atoms/Button/BaseButton'
import styles from './CatalogSwitch.module.scss'

const CatalogSwitch = () => (
	<div className={styles['catalog-switch']}>
		<BaseButton variantColor='primary'>Лучшие</BaseButton>
		<BaseButton variantColor='secondary'>Поиск</BaseButton>
	</div>
)

export default CatalogSwitch
