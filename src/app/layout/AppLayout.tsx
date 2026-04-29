import { StyleSheet, View } from 'react-native'

import { RootStackNavigator } from '@/app/navigation/RootStackNavigator'

export function AppLayout() {
	return (
		<View style={styles.root}>
			<RootStackNavigator />
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
})
