import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StyleSheet, Text, View } from 'react-native'

import {
	PRODUCT_ROUTES,
	type ProductsStackParamList,
} from '@/shared/routes'
import { Button, PageTitle } from '@/shared/ui'

type Props = NativeStackScreenProps<
	ProductsStackParamList,
	typeof PRODUCT_ROUTES.createProduct
>

export function ProductCreateScreen({ navigation }: Props) {
	return (
		<View style={styles.root}>
			<PageTitle title='Создание продукта' />
			<Text style={styles.description}>
				Здесь будет форма создания нового продукта.
			</Text>
			<Button onPress={() => navigation.goBack()} title='Назад' />
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		padding: 16,
		gap: 12,
	},
	description: {
		fontSize: 16,
	},
})
