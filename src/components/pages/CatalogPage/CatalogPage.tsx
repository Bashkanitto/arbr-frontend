import CatalogFilters from './CatalogFilter/CatalogFilters'
import styles from './CatalogPage.module.scss'
import CatalogSwitch from './CatalogSwitch/CatalogSwitch'
import Tender from './Tender/Tender'

const CatalogPage = () => {
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
		<div className={styles['catalog-page']}>
			<CatalogSwitch />
			<p className={styles['catalog-title']}>Каталог</p>
			<p className={styles['catalog-description']}>Топ - 50</p>
			<CatalogFilters />
			<div className={styles['catalog-tenders']}>
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

export default CatalogPage
