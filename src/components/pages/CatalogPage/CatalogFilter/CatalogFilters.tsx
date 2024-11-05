import { BaseButton } from '../../../atoms/Button/BaseButton'
import styles from './CatalogFilters.module.scss'

const CatalogFilters = ({ addCatalog }: { addCatalog: () => void }) => {
	return (
		<div className={styles['catalog-header']}>
			<div className={styles['catalog-filter']}>
				<BaseButton variantColor='primary'>За 3 месяца</BaseButton>
				<BaseButton variantColor='secondary'>За 6 месяцев</BaseButton>
				<BaseButton variantColor='secondary'>За год</BaseButton>
			</div>
			<div className={styles['catalog-actions']}>
				<BaseButton onClick={addCatalog} variantColor='secondary'>
					Добавить каталог
				</BaseButton>
				<BaseButton variantColor='primary'>Создать товар</BaseButton>
			</div>
		</div>
	)
}

export default CatalogFilters
