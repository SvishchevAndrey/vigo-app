import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Text, View } from 'react-native'

import {
	PRODUCT_ROUTES,
	type ProductsStackParamList,
} from '@/shared/routes'
import { Button, PageTitle } from '@/shared/ui'

type Props = NativeStackScreenProps<
	ProductsStackParamList,
	typeof PRODUCT_ROUTES.productDetails
>

export function ProductDetailsScreen({ navigation, route }: Props) {
	return (
		<View>
			<PageTitle title='Детали продукта' />
			<Button onPress={() => navigation.goBack()} title='Назад' />
			<Text>ID продукта: {route.params.productId}</Text>
		</View>
	)
}
