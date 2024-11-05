import Tender from '../../molecules/Tender/Tender'
import CatalogSwitch from '../CatalogPage/CatalogSwitch/CatalogSwitch'
import SearchFilters from './SearchFilters/SearchFilters'
import styles from './SearchPage.module.scss'

const SearchPage = () => {
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
			id: 3,
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
	]

	return (
		<div className={styles['search-page']}>
			<CatalogSwitch />
			<p className={styles['search-title']}>Поиск</p>
			<p className={styles['search-description']}>
				{customerLength} cпециалистов
			</p>
			<SearchFilters />
			<div className={styles['search-tenders']}>
				{userData.map(user => (
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
