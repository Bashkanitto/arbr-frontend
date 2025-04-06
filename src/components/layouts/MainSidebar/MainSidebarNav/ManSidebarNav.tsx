import { Link, useLocation } from 'react-router-dom'
import { CoinsIcon, LockIcon, SearchIcon, StatusIcon } from '../../../../assets/icons'
import { CalendarIcon } from '../../../../assets/icons/CalendarIcon'
import { CatalogIcon } from '../../../../assets/icons/CatalogIcon'
import { HistoryIcon } from '../../../../assets/icons/HistoryIcon'
import { UserIcon } from '../../../../assets/icons/UserIcon'
import { RouteNavList } from '../../../../constants/router'
import authStore from '../../../../store/AuthStore'
import styles from './MainSidebarNav.module.scss'
import { BrandIcon } from '../../../../assets/icons/BrandIcon'

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
    icon: <HistoryIcon />,
    title: 'История',
    route: RouteNavList.history(),
  },
  {
    icon: <SearchIcon />,
    title: 'Поиск',
    route: RouteNavList.search(),
  },
  {
    icon: <BrandIcon />,
    title: 'Бренды',
    route: RouteNavList.brand(),
  },
  {
    icon: <BrandIcon />,
    title: 'Баннеры',
    route: RouteNavList.banner(),
  },
  {
    icon: <StatusIcon />,
    title: 'Мои Заказы',
    route: RouteNavList.order(),
  },
  {
    icon: <CoinsIcon />,
    title: 'Выплаты',
    route: RouteNavList.withdraws(),
  },
  {
    icon: <CoinsIcon />,
    title: 'Запрос на вывод',
    route: RouteNavList.paymentRequest(),
  },
  {
    icon: <LockIcon />,
    title: 'Безопасность',
    route: RouteNavList.security(),
  },
  {
    icon: <CalendarIcon />,
    title: 'Заявки',
    route: RouteNavList.applications(),
  },
  {
    icon: <CalendarIcon />,
    title: 'Логи',
    route: RouteNavList.logs(),
  },
]

export const MainSidebarNav = () => {
  const location = useLocation()
  const { userProfile } = authStore

  // Фильтрация пунктов меню на основе роли(админ видит все, vedor - массив)
  const filteredNavItems = navItems.filter(item => {
    if (!userProfile) return false
    if (userProfile.role === 'admin') {
      return [
        'Менеджеры',
        'Каталог',
        // 'Поиск',
        // "Выплаты",
        'Бренды',
        'Баннеры',
        'Запрос на вывод',
        'Безопасность',
        // 'История',
        'Заявки',
        'Логи',
      ].includes(item.title)
    }
    if (userProfile.role === 'vendor') {
      return ['Каталог', 'Мои Заказы', 'История', 'Запрос на вывод', 'Заявки'].includes(item.title)
    }
    return false
  })

  return (
    <nav className={styles['main-sidebar-nav']}>
      {filteredNavItems.map((item, index) => (
        <Link
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
