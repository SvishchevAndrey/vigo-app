import type { ComponentType } from 'react'

import { HomeScreen } from '@/screens/home'
import { ProductsStackNavigator } from '@/app/navigation/ProductsStackNavigator'
import { SettingsScreen } from '@/screens/settings'
import { APP_ROUTES, type AppRoute } from './routes'

type RouteConfig = {
	label: string
	component: ComponentType
}

export const TAB_ROUTES: Record<AppRoute, RouteConfig> = {
	[APP_ROUTES.home]: {
		label: 'Главная',
		component: HomeScreen,
	},
	[APP_ROUTES.products]: {
		label: 'Продукты',
		component: ProductsStackNavigator,
	},
	[APP_ROUTES.settings]: {
		label: 'Настройки',
		component: SettingsScreen,
	},
}
