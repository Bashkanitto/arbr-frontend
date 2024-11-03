import { Input, Select } from '@mantine/core'
import styles from './SearchFilters.module.scss'

const SearchFilters = () => {
	return (
		<div className={styles['search-header']}>
			<Input placeholder='Имя пользователя или ключевое слово' />
			<Select
				placeholder='Все Категории'
				data={[
					{ value: '', label: 'Все' },
					{ value: 'Создано', label: 'Создано' },
					{ value: 'Подтверждено', label: 'Подтверждено' },
				]}
			/>
			<Select
				placeholder='Все города'
				data={[
					{ value: '', label: 'Все' },
					{ value: 'Создано', label: 'Создано' },
					{ value: 'Подтверждено', label: 'Подтверждено' },
				]}
			/>
		</div>
	)
}

export default SearchFilters
