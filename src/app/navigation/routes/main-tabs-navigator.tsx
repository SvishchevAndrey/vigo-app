import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { APP_ROUTES, type AppTabsParamList } from '@/shared/routes'
import { HomeScreen } from '@/screens/home'
import { SettingsScreen } from '@/screens/settings'
import { BottomNavigation } from '@/widgets/bottom-navigation'
import { HIDDEN_HEADER_OPTIONS } from '../constants/options'
import { ProductsStackNavigator } from './products-stack-navigator'

const Tab = createBottomTabNavigator<AppTabsParamList>()

export function MainTabsNavigator() {
	return (
		<Tab.Navigator
			initialRouteName={APP_ROUTES.home}
			screenOptions={HIDDEN_HEADER_OPTIONS}
			tabBar={props => <BottomNavigation {...props} />}
		>
			<Tab.Screen
				component={HomeScreen}
				name={APP_ROUTES.home}
				options={{ tabBarLabel: 'Главная' }}
			/>
			<Tab.Screen
				component={ProductsStackNavigator}
				name={APP_ROUTES.products}
				options={{ tabBarLabel: 'Продукты' }}
			/>
			<Tab.Screen
				component={SettingsScreen}
				name={APP_ROUTES.settings}
				options={{ tabBarLabel: 'Настройки' }}
			/>
		</Tab.Navigator>
	)
}
