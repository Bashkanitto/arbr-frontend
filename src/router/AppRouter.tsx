import { Loader } from '@mantine/core'
import { Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '../components/layouts/MainLayout'
import AuthPage from '../components/pages/AuthPage/AuthPage'
import CatalogPage from '../components/pages/CatalogPage/CatalogPage'
import ManagersPage from '../components/pages/ManagersPage/ManagersPage'
import NotFoundPage from '../components/pages/NotFoundPage/NotFoundPage'
import SearchPage from '../components/pages/SearchPage/SearchPage'
import SecurityPage from '../components/pages/SecurityPage/SecurityPage'
import SuppliesPage from '../components/pages/SuppliesPage/SuppliesPage'
import WithdrawsPage from '../components/pages/WithdrawsPage/WithdrawsPage'
import { RouteNavList, RoutePathList } from '../constants/router'
import authStore from '../store/AuthStore'
import { AuthProtect } from './AuthProtect'

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
								<Navigate to={RouteNavList.catalog()} />
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
								element={<AuthProtect allowedRoles={['admin', 'vendor']} />}
							>
								<Route path='' element={<CatalogPage />} />
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
								path={RoutePathList.supplies}
								element={<AuthProtect allowedRoles={['admin', 'vendor']} />}
							>
								<Route path='' element={<SuppliesPage />} />
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
