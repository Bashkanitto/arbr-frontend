import { Link, useLocation } from 'react-router-dom'
import {
	CoinsIcon,
	LockIcon,
	SearchIcon,
	StatusIcon,
} from '../../../../assets/icons'
import { CatalogIcon } from '../../../../assets/icons/CatalogIcon'
import { UserIcon } from '../../../../assets/icons/UserIcon'
import { RouteNavList } from '../../../../constants/router'
import authStore from '../../../../store/AuthStore'
import styles from './MainSidebarNav.module.scss'

const navItems = [
	{
		icon: <UserIcon />,
		title: 'Менеджеры',
		route: RouteNavList.managers(),
	},
	{
		icon: <CatalogIcon />,
		title: 'Каталог',
		route: RouteNavList.catalog(),
	},
	{
		icon: <CatalogIcon />,
		title: 'Cделки',
		route: RouteNavList.notfound(),
	},
	{
		icon: <CatalogIcon />,
		title: 'Заявки',
		route: RouteNavList.notfound(),
	},
	{
		icon: <SearchIcon />,
		title: 'Поиск',
		route: RouteNavList.search(),
	},
	{
		icon: <StatusIcon />,
		title: 'Список',
		route: RouteNavList.list(),
	},
	{
		icon: <CoinsIcon />,
		title: 'Выплаты',
		route: RouteNavList.withdraws(),
	},
	{
		icon: <LockIcon />,
		title: 'Безопасность',
		route: RouteNavList.security(),
	},
]

export const MainSidebarNav = () => {
	const location = useLocation()
	const { userProfile } = authStore

	// Фильтрация пунктов меню на основе роли(админ видит все, vedor - массив)
	const filteredNavItems = navItems.filter(item => {
		if (!userProfile) return false
		if (userProfile.role === 'admin') return true
		if (userProfile.role === 'vendor') {
			return ['Каталог', 'Cделки', 'Заявки', 'Безопасность'].includes(
				item.title
			)
		}
		return false
	})

	return (
		<nav className={styles['main-sidebar-nav']}>
			{filteredNavItems.map((item, index) => (
				<Link
					key={index}
					className={styles['nav-item']}
					data-active={location.pathname.includes(item.title)}
					to={item.route}
				>
					<span className={styles['icon']}>{item.icon}</span>
					<span className={styles['title']}>{item.title}</span>
				</Link>
			))}
		</nav>
	)
}
