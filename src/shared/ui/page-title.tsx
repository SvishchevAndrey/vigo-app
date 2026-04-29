import { StyleSheet, Text, View } from 'react-native'

import { colors } from '../config/theme'

type PageTitleProps = {
	title: string
}

export function PageTitle({ title }: PageTitleProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>{title}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'transparent',
	},
	title: {
		fontSize: 28,
		fontWeight: '600',
		color: colors.text,
	},
})
