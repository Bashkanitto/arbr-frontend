import { Loader } from '@mantine/core'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '../components/layouts/MainLayout'
import { RouteNavList, RoutePathList } from '../constants/router'
import { wait } from '../helpers'
import { AuthProtect } from './AuthProtect'

const ManagersPage = lazy(async () => {
	await wait(500)
	return import('../components/pages/ManagersPage/ManagersPage')
})
const AuthPage = lazy(async () => {
	await wait(500)
	return import('../components/pages/AuthPage/AuthPage')
})
const CatalogPage = lazy(async () => {
	await wait(500)
	return import('../components/pages/CatalogPage/CatalogPage')
})
const WithdrawsPage = lazy(async () => {
	await wait(500)
	return import('../components/pages/WithdrawsPage/WithdrawsPage')
})
const NotFoundPage = lazy(async () => {
	await wait(500)
	return import('../components/pages/NotFoundPage/NotFoundPage')
})
const SearchPage = lazy(async () => {
	await wait(500)
	return import('../components/pages/SearchPage/SearchPage')
})
const SecurityPage = lazy(async () => {
	await wait(500)
	return import('../components/pages/SecurityPage/SecurityPage')
})
const ProductPage = lazy(async () => {
	await wait(500)
	return import('../components/pages/ProductPage/ProductPage')
})

export const AppRouter = () => {
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
					<Route path='/' element={<Navigate to={RouteNavList.managers()} />} />
					<Route path={RoutePathList.auth} Component={AuthPage} />
					<Route Component={AuthProtect}>
						<Route Component={MainLayout}>
							<Route path={RoutePathList.managers} Component={ManagersPage} />
							<Route path={RoutePathList.catalog} Component={CatalogPage} />
							<Route path={RoutePathList.notfound} Component={NotFoundPage} />
							<Route path={RoutePathList.search} Component={SearchPage} />
							<Route path={RoutePathList.product} Component={ProductPage} />
							<Route path={RoutePathList.list} Component={NotFoundPage} />
							<Route path={RoutePathList.withdraws} Component={WithdrawsPage} />
							<Route path={RoutePathList.security} Component={SecurityPage} />
						</Route>
					</Route>
					<Route path='*' element={<Navigate to='/notfound' />} />
				</Routes>
			</BrowserRouter>
		</Suspense>
	)
}
