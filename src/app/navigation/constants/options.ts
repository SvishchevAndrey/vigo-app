import type { NativeStackNavigationOptions } from '@react-navigation/native-stack'

export const HIDDEN_HEADER_OPTIONS = { headerShown: false } as const

export const MODAL_SCREEN_OPTIONS: NativeStackNavigationOptions = {
	...HIDDEN_HEADER_OPTIONS,
	animation: 'slide_from_bottom',
	animationDuration: 300,
}
