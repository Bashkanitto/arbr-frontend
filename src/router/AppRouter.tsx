import { Loader } from '@mantine/core'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@components/layouts/MainLayout'
import { RouteNavList, RoutePathList } from '@shared/utils/router'
import { AuthProtect } from './AuthProtect'
import authStore from '@app/AuthStore'
import ManagersPage from '@pages/ManagersPage/ManagersPage'

// Lazy load components
const ApplicationPage = lazy(() => import('@pages/ApplicationPage/ApplicationPage'))
const BrandPage = lazy(() => import('@pages/BrandPage/BrandPage'))
const LogsPage = lazy(() => import('@pages/logsPage/LogsPage'))
const BannerPage = lazy(() => import('@pages/BannerPage/BannerPage'))
const OrdersPage = lazy(() => import('@pages/OrdersPage/OrdersPage'))
const AuthPage = lazy(() => import('@pages/AuthPage/AuthPage'))
const CatalogPage = lazy(() => import('@pages/CatalogPage/CatalogPage'))
const MyOrdersPage = lazy(() => import('@pages/MyOrdersPage/MyOrdersPage'))
const NotFoundPage = lazy(() => import('@pages/NotFoundPage/NotFoundPage'))
const ProductPage = lazy(() => import('@pages/ProductPage/ProductPage'))
const SearchPage = lazy(() => import('@pages/SearchPage/SearchPage'))
const UsersPage = lazy(() => import('@pages/UsersPage/UsersPage'))
const PaymentRequestPage = lazy(() => import('@pages/PaymentRequestPage/PaymentRequestPage'))
const VendorPage = lazy(() => import('@pages/VendorPage/VendorPage'))
const WithdrawsPage = lazy(() => import('@pages/WithdrawsPage/WithdrawsPage'))

export const AppRouter = () => {
  const { userProfile } = authStore
  return (
    <Suspense
      fallback={
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loader size={40} />
        </div>
      }
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              !userProfile ? (
                <Navigate to={RoutePathList.auth} />
              ) : userProfile.role === 'admin' ? (
                <Navigate to={RouteNavList.managers()} />
              ) : (
                <Navigate to={`/vendor/${userProfile.id}`} />
              )
            }
          />
          <Route path={RoutePathList.auth} element={<AuthPage />} />

          {/* Protected Routes */}
          <Route element={<AuthProtect allowedRoles={['admin', 'vendor']} />}>
            <Route element={<MainLayout />}>
              <Route
                path={RoutePathList.managers}
                element={<AuthProtect allowedRoles={['admin']} />}
              >
                <Route path="" element={<ManagersPage />} />
              </Route>

              {/* Vendor and Admin shared routes */}
              <Route
                path={RoutePathList.catalog}
                element={<AuthProtect allowedRoles={['admin']} />}
              >
                <Route path="" element={<CatalogPage />} />
              </Route>
              <Route path={RoutePathList.brand} element={<AuthProtect allowedRoles={['admin']} />}>
                <Route path="" element={<BrandPage />} />
              </Route>

              <Route
                path={RoutePathList.paymentRequest}
                element={<AuthProtect allowedRoles={['admin']} />}
              >
                <Route path="" element={<PaymentRequestPage />} />
              </Route>

              <Route path={RoutePathList.logs} element={<AuthProtect allowedRoles={['admin']} />}>
                <Route path="" element={<LogsPage />} />
              </Route>

              <Route path={RoutePathList.banner} element={<AuthProtect allowedRoles={['admin']} />}>
                <Route path="" element={<BannerPage />} />
              </Route>

              <Route path={RoutePathList.order} element={<AuthProtect allowedRoles={['vendor']} />}>
                <Route path="" element={<MyOrdersPage />} />
              </Route>

              <Route
                path={RoutePathList.applications}
                element={<AuthProtect allowedRoles={['admin', 'vendor']} />}
              >
                <Route path="" element={<ApplicationPage />} />
              </Route>

              <Route
                path={RoutePathList.withdraws}
                element={<AuthProtect allowedRoles={['admin']} />}
              >
                <Route path="" element={<WithdrawsPage />} />
              </Route>

              <Route path={RoutePathList.search} element={<AuthProtect allowedRoles={['admin']} />}>
                <Route path="" element={<SearchPage />} />
              </Route>

              <Route path={RoutePathList.orders} element={<AuthProtect allowedRoles={['admin']} />}>
                <Route path="" element={<OrdersPage />} />
              </Route>

              <Route
                path={RoutePathList.vendor}
                element={<AuthProtect allowedRoles={['admin', 'vendor']} />}
              >
                <Route path="" element={<VendorPage />} />
              </Route>
              <Route
                path={RoutePathList.product}
                element={<AuthProtect allowedRoles={['admin', 'vendor']} />}
              >
                <Route path="" element={<ProductPage />} />
              </Route>

              <Route path={RoutePathList.users} element={<AuthProtect allowedRoles={['admin']} />}>
                <Route path={RoutePathList.users} element={<UsersPage />} />
              </Route>
              <Route path={RoutePathList.notfound} element={<NotFoundPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/notfound" />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}
