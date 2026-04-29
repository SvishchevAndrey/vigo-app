import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StyleSheet, View } from 'react-native'

import { PRODUCT_ROUTES, type ProductsStackParamList } from '@/app/router/routes'
import { Button, PageTitle } from '@/shared/ui'

export function ProductsScreen() {
	const navigation =
		useNavigation<NativeStackNavigationProp<ProductsStackParamList>>()

	return (
		<View style={styles.root}>
			<PageTitle title='Продукты' />
			<Button
				title='Открыть продукт #42'
				onPress={() => {
					navigation.navigate(PRODUCT_ROUTES.productDetails, { productId: '42' })
				}}
			/>
			<Button
				title='Создать продукт'
				onPress={() => {
					navigation.navigate(PRODUCT_ROUTES.createProduct)
				}}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		padding: 16,
		gap: 12,
	},
})
