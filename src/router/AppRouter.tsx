import { Loader } from '@mantine/core'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '../components/layouts/MainLayout'
import ManagersPage from '../components/pages/ManagersPage/ManagersPage'
import { RouteNavList, RoutePathList } from '../constants/router'
import authStore from '../store/AuthStore'
import { AuthProtect } from './AuthProtect'

// Lazy load components
const ApplicationPage = lazy(() => import('../components/pages/ApplicationPage/ApplicationPage'));
const AuthPage = lazy(() => import('../components/pages/AuthPage/AuthPage'));
const CatalogPage = lazy(() => import('../components/pages/CatalogPage/CatalogPage'));
const MyOrdersPage = lazy(() => import('../components/pages/MyOrdersPage/MyOrdersPage'));
const NotFoundPage = lazy(() => import('../components/pages/NotFoundPage/NotFoundPage'));
const ProductPage = lazy(() => import('../components/pages/ProductPage/ProductPage'));
const SearchPage = lazy(() => import('../components/pages/SearchPage/SearchPage'));
const SecurityPage = lazy(() => import('../components/pages/SecurityPage/SecurityPage'));
const SuppliesPage = lazy(() => import('../components/pages/SuppliesPage/SuppliesPage'));
const VendorPage = lazy(() => import('../components/pages/VendorPage/VendorPage'));
const WithdrawsPage = lazy(() => import('../components/pages/WithdrawsPage/WithdrawsPage'));

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
						path='/'
						element={
							userProfile?.role == 'admin' ? (
								<Navigate to={RouteNavList.managers()} />
							) : (
								<Navigate to={RouteNavList.vendor()} />
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
								<Route path='' element={<ManagersPage />} />
							</Route>

							{/* Vendor and Admin shared routes */}
							<Route
								path={RoutePathList.catalog}
								element={<AuthProtect allowedRoles={['admin']} />}
							>
								<Route path='' element={<CatalogPage />} />
							</Route>

							<Route
								path={RoutePathList.order}
								element={<AuthProtect allowedRoles={['vendor']} />}
							>
								<Route path='' element={<MyOrdersPage />} />
							</Route>

							<Route
								path={RoutePathList.applications}
								element={<AuthProtect allowedRoles={['admin', 'vendor']} />}
							>
								<Route path='' element={<ApplicationPage />} />
							</Route>

							<Route
								path={RoutePathList.withdraws}
								element={<AuthProtect allowedRoles={['admin']} />}
							>
								<Route path='' element={<WithdrawsPage />} />
							</Route>

							<Route
								path={RoutePathList.search}
								element={<AuthProtect allowedRoles={['admin']} />}
							>
								<Route path='' element={<SearchPage />} />
							</Route>

							<Route
								path={RoutePathList.vendor}
								element={<AuthProtect allowedRoles={['admin', 'vendor']} />}
							>
								<Route path='' element={<VendorPage />} />
							</Route>

							<Route
								path={RoutePathList.supplies}
								element={<AuthProtect allowedRoles={['vendor']} />}
							>
								<Route path='' element={<SuppliesPage />} />
							</Route>

							<Route
								path={RoutePathList.product}
								element={<AuthProtect allowedRoles={['admin', 'vendor']} />}
							>
								<Route path='' element={<ProductPage />} />
							</Route>

							<Route
								path={RoutePathList.security}
								element={<AuthProtect allowedRoles={['admin']} />}
							>
								<Route
									path={RoutePathList.security}
									element={<SecurityPage />}
								/>
							</Route>
							<Route path={RoutePathList.notfound} element={<NotFoundPage />} />
						</Route>
					</Route>

					<Route path='*' element={<Navigate to='/notfound' />} />
				</Routes>
			</BrowserRouter>
		</Suspense>
	)
}
