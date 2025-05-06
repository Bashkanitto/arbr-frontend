// routesConfig.ts
import ManagersPage from '@pages/ManagersPage/ManagersPage'
import CatalogPage from '@pages/CatalogPage/CatalogPage'
import { RoutePathList } from '@shared/utils/router'
import MyOrdersPage from '@pages/MyOrdersPage/MyOrdersPage'
import ApplicationPage from '@pages/ApplicationPage/ApplicationPage'
import BrandPage from '@pages/BrandPage/BrandPage'
import BannerPage from '@pages/BannerPage/BannerPage'
import LogsPage from '@pages/logsPage/LogsPage'
import OrdersPage from '@pages/OrdersPage/OrdersPage'
import PaymentRequestPage from '@pages/PaymentRequestPage/PaymentRequestPage'
import WithdrawsPage from '@pages/WithdrawsPage/WithdrawsPage'
import SearchPage from '@pages/SearchPage/SearchPage'
import VendorPage from '@pages/VendorPage/VendorPage'

export const routes = [
  {
    path: RoutePathList.managers,
    roles: ['admin'],
    element: <ManagersPage />,
  },
  {
    path: RoutePathList.catalog,
    roles: ['admin'],
    element: <CatalogPage />,
  },
  {
    path: RoutePathList.brand,
    roles: ['admin'],
    element: <BrandPage />,
  },
  {
    path: RoutePathList.paymentRequest,
    roles: ['admin'],
    element: <PaymentRequestPage />,
  },
  {
    path: RoutePathList.logs,
    roles: ['vendor'],
    element: <LogsPage />,
  },
  {
    path: RoutePathList.banner,
    roles: ['admin'],
    element: <BannerPage />,
  },
  {
    path: RoutePathList.order,
    roles: ['vendor'],
    element: <MyOrdersPage />,
  },
  {
    path: RoutePathList.applications,
    roles: ['admin, vendor'],
    element: <ApplicationPage />,
  },
  {
    path: RoutePathList.withdraws,
    roles: ['admin'],
    element: <WithdrawsPage />,
  },
  {
    path: RoutePathList.search,
    roles: ['admin'],
    element: <SearchPage />,
  },
  {
    path: RoutePathList.orders,
    roles: ['admin'],
    element: <OrdersPage />,
  },
  {
    path: RoutePathList.vendor,
    roles: ['admin', 'vendor'],
    element: <VendorPage />,
  },
  {
    path: RoutePathList.paymentRequest,
    roles: ['vendor'],
    element: <PaymentRequestPage />,
  },
]
