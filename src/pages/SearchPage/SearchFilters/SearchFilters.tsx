import { Input, Select } from '@mantine/core'
import React from 'react'
import styles from './SearchFilters.module.scss'

interface SearchFiltersProps {
	setSearchTerm: (term: string) => void
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ setSearchTerm }) => {
	return (
		<div className={styles['search-header']}>
			<Input
				placeholder='Имя пользователя или ключевое слово'
				onChange={event => setSearchTerm(event.currentTarget.value)}
			/>
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
