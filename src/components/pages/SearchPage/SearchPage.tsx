import { useState } from 'react'
import Tender from '../../molecules/Tender/Tender'
import CatalogSwitch from '../CatalogPage/CatalogSwitch/CatalogSwitch'
import SearchFilters from './SearchFilters/SearchFilters'
import styles from './SearchPage.module.scss'

const SearchPage = () => {
	const [searchQuery, setSearchQuery] = useState('')

	const customerLength = '19 300'
	const userData = [
		{
			id: 0,
			title: 'БФГ',
			name: 'Самса сенсей',
			rang: 96,
			rangCount: 12,
			winned: '95/106',
			sold: 1007,
			tenders: [
				{
					id: 0,
					title: 'БФГ',
					image: '/',
				},
				{
					id: 1,
					title: 'БФГ',
					image: '/',
				},
				{
					id: 2,
					title: 'БФГ',
					image: '/',
				},
				{
					id: 3,
					title: 'БФГ',
					image: '/',
				},
			],
		},
		{
			id: 2,
			title: 'БФГ',
			name: 'данияр ',
			rang: 96,
			rangCount: 12,
			winned: '95/106',
			sold: 1007,
			tenders: [
				{
					id: 0,
					title: 'БФГ',
					image: '/',
				},
				{
					id: 1,
					title: 'БФГ',
					image: '/',
				},
				{
					id: 2,
					title: 'БФГ',
					image: '/',
				},
				{
					id: 3,
					title: 'БФГ',
					image: '/',
				},
			],
		},
		{
			id: 3,
			title: 'БФГ',
			name: 'Кана сенсей',
			rang: 96,
			rangCount: 12,
			winned: '95/106',
			sold: 1007,
			tenders: [
				{
					id: 0,
					title: 'БФГ',
					image: '/',
				},
				{
					id: 1,
					title: 'БФГ',
					image: '/',
				},
				{
					id: 2,
					title: 'БФГ',
					image: '/',
				},
				{
					id: 3,
					title: 'БФГ',
					image: '/',
				},
			],
		},
	]

	// Фильтрация данных на основе запроса
	const filteredUserData = userData.filter(user =>
		user.name.toLowerCase().includes(searchQuery.toLowerCase())
	)

	return (
		<div className={styles['search-page']}>
			<CatalogSwitch />
			<p className={styles['search-title']}>Поиск</p>
			<p className={styles['search-description']}>
				{customerLength} специалистов
			</p>
			<SearchFilters setSearchTerm={setSearchQuery} />
			<div className={styles['search-tenders']}>
				{filteredUserData.map(user => (
					<Tender
						key={user.id}
						id={user.id}
						name={user.name}
						rang={user.rang}
						winned={user.winned}
						title={user.title}
						sold={user.sold}
						tenders={user.tenders}
					/>
				))}
			</div>
		</div>
	)
}

export default SearchPage
