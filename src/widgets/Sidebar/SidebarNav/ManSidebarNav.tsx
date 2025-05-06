import { Link, useLocation } from 'react-router-dom'
import {
  CoinsIcon,
  SearchIcon,
  StatusIcon,
  CalendarIcon,
  CatalogIcon,
  HistoryIcon,
  UserIcon,
  BrandIcon,
} from '@shared/icons'
import { RouteNavList } from '@shared/utils/router'
import authStore from '@app/AuthStore'
import styles from './MainSidebarNav.module.scss'
import { Logs, Megaphone, ShoppingBag, Users } from 'lucide-react'

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
    icon: <Megaphone />,
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
    icon: <Users />,
    title: 'Пользователи',
    route: RouteNavList.users(),
  },
  {
    icon: <ShoppingBag />,
    title: 'Заказы',
    route: RouteNavList.orders(),
  },
  {
    icon: <CalendarIcon />,
    title: 'Заявки на продукт',
    route: RouteNavList.applications(),
  },
  {
    icon: <Logs />,
    title: 'Логи',
    route: RouteNavList.logs(),
  },
]

export const MainSidebarNav = () => {
  const location = useLocation()
  const { userProfile } = authStore

  // Фильтрация пунктов меню на основе роли(админ видит все, vedor - массив)
  const filteredNavItems = navItems.filter(item => {
    if (!userProfile) return []
    if (userProfile.role === 'admin') {
      return [
        'Менеджеры',
        'Каталог',
        'Бренды',
        'Баннеры',
        'Запрос на вывод',
        'Пользователи',
        'Заявки на продукт',
        'Заказы',
        'Логи',
        // 'Поиск',
        // "Выплаты",
        // 'История',
      ].includes(item.title)
    }
    if (userProfile.role === 'vendor') {
      return ['Каталог', 'Мои Заказы', 'История', 'Заявки на продукт'].includes(item.title)
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
