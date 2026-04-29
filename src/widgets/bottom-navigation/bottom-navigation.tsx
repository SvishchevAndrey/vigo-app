import { memo } from 'react'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors } from '../../shared/config/theme'

function BottomNavigationComponent({
	state,
	descriptors,
	navigation,
}: BottomTabBarProps) {
	const insets = useSafeAreaInsets()

	return (
		<View
			style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}
		>
			{state.routes.map((route, index) => {
				const descriptor = descriptors[route.key]
				const isFocused = state.index === index

				const label =
					typeof descriptor.options.tabBarLabel === 'string'
						? descriptor.options.tabBarLabel
						: descriptor.options.title ?? route.name

				const onPress = () => {
					const event = navigation.emit({
						type: 'tabPress',
						target: route.key,
						canPreventDefault: true,
					})

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name, route.params)
					}
				}

				const onLongPress = () => {
					navigation.emit({
						type: 'tabLongPress',
						target: route.key,
					})
				}

				return (
					<Pressable
						key={route.key}
						accessibilityRole='button'
						accessibilityState={isFocused ? { selected: true } : {}}
						onLongPress={onLongPress}
						onPress={onPress}
						style={styles.button}
					>
						<Text style={[styles.label, isFocused && styles.activeLabel]}>{label}</Text>
					</Pressable>
				)
			})}
		</View>
	)
}

export const BottomNavigation = memo(BottomNavigationComponent)

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		borderTopWidth: 1,
		borderTopColor: colors.border,
		backgroundColor: colors.panelBackground,
		paddingTop: 10,
	},
	button: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 8,
	},
	label: {
		fontSize: 14,
		fontWeight: '500',
		color: colors.navText,
	},
	activeLabel: {
		textDecorationLine: 'underline',
	},
})
