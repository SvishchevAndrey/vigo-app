import { colors } from '@/shared/config'
import { StyleSheet, View, ViewStyle } from 'react-native'

type Props = {
	children: React.ReactNode
	style?: ViewStyle
}

export const ThemeView = ({ children, style }: Props) => {
	return <View style={[styles.root, style]}>{children}</View>
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: colors.background,
	},
})
