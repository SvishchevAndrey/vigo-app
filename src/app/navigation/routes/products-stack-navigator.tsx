import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { PRODUCT_ROUTES, type ProductsStackParamList } from '@/shared/routes'
import { ProductCreateScreen } from '@/screens/product-create'
import { ProductDetailsScreen } from '@/screens/product-detail'
import { ProductsScreen } from '@/screens/products'
import {
	HIDDEN_HEADER_OPTIONS,
	MODAL_SCREEN_OPTIONS,
} from '../constants/options'

const Stack = createNativeStackNavigator<ProductsStackParamList>()

export function ProductsStackNavigator() {
	return (
		<Stack.Navigator initialRouteName={PRODUCT_ROUTES.productsList}>
			<Stack.Screen
				component={ProductsScreen}
				name={PRODUCT_ROUTES.productsList}
				options={HIDDEN_HEADER_OPTIONS}
			/>
			<Stack.Screen
				component={ProductDetailsScreen}
				name={PRODUCT_ROUTES.productDetails}
				options={HIDDEN_HEADER_OPTIONS}
			/>
			<Stack.Screen
				component={ProductCreateScreen}
				name={PRODUCT_ROUTES.createProduct}
				options={MODAL_SCREEN_OPTIONS}
			/>
		</Stack.Navigator>
	)
}
