import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { ROOT_ROUTES, type RootStackParamList } from '@/shared/routes'
import { HIDDEN_HEADER_OPTIONS } from '../constants/options'
import { MainTabsNavigator } from './main-tabs-navigator'

const Stack = createNativeStackNavigator<RootStackParamList>()

export function RootStackNavigator() {
	return (
		<Stack.Navigator initialRouteName={ROOT_ROUTES.mainTabs}>
			<Stack.Screen
				component={MainTabsNavigator}
				name={ROOT_ROUTES.mainTabs}
				options={HIDDEN_HEADER_OPTIONS}
			/>
		</Stack.Navigator>
	)
}
