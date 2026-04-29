import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'

import { colors } from '@/shared/config/theme'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { AppLayout } from './layout/app-layout'
import { UpdateNotifier } from './update'

export function App() {
	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<SafeAreaView style={styles.safeArea} edges={['top']}>
					<View style={styles.root}>
						<StatusBar
							style='light'
							backgroundColor={colors.background}
							translucent={false}
						/>
						<AppLayout />
						<UpdateNotifier />
					</View>
				</SafeAreaView>
			</NavigationContainer>
		</SafeAreaProvider>
	)
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: colors.background,
	},
	root: {
		flex: 1,
		backgroundColor: colors.background,
	},
})
