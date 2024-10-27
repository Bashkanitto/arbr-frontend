import { Link, useLocation } from 'react-router-dom'
import {
	CoinsIcon,
	LockIcon,
	SearchIcon,
	StatusIcon,
} from '../../../../assets/icons'
import { UserIcon } from '../../../../assets/icons/UserIcon'
import { RouteNavList } from '../../../../constants/router'
import styles from './MainSidebarNav.module.scss'

const navItems = [
	{
		icon: <UserIcon />,
		title: 'Менеджеры',
		route: RouteNavList.managers(),
	},
	{
		icon: <SearchIcon />,
		title: 'Поиск',
		route: RouteNavList.search(),
	},
	{
		icon: <StatusIcon />,
		title: 'Список',
		route: '2',
	},
	{
		icon: <CoinsIcon />,
		title: 'Выплаты',
		route: RouteNavList.withdraws(),
	},
	{
		icon: <LockIcon />,
		title: 'Безопасность',
		route: '3',
	},
]

export const MainSidebarNav = () => {
	const location = useLocation()

	return (
		<nav className={styles['main-sidebar-nav']}>
			{navItems.map((item, index) => (
				<Link
					style={{}}
					key={index}
					className={styles['nav-item']}
					data-active={location.pathname.includes(item.route)}
					to={item.route}
				>
					<span className={styles['icon']}>{item.icon}</span>
					<span className={styles['title']}>{item.title}</span>
				</Link>
			))}
		</nav>
	)
}
