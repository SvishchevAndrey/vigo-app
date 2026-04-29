import { useEffect, useRef, useState } from 'react'
import * as Updates from 'expo-updates'
import {
	AppState,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native'

import { colors } from '@/shared/config'
import { Button } from '@/shared/ui'

export function UpdateNotifier() {
	const [isVisible, setIsVisible] = useState(false)
	const [isUpdating, setIsUpdating] = useState(false)
	const isCheckingRef = useRef(false)

	useEffect(() => {
		if (__DEV__ || !Updates.isEnabled) {
			return
		}

		void checkForUpdates()

		const subscription = AppState.addEventListener('change', nextState => {
			if (nextState === 'active') {
				void checkForUpdates()
			}
		})

		return () => {
			subscription.remove()
		}
	}, [])

	const checkForUpdates = async () => {
		if (isCheckingRef.current || isUpdating) {
			return
		}

		isCheckingRef.current = true

		try {
			const update = await Updates.checkForUpdateAsync()

			if (update.isAvailable) {
				setIsVisible(true)
				return
			}

			setIsVisible(false)
		} catch {
			setIsVisible(false)
		} finally {
			isCheckingRef.current = false
		}
	}

	const handleUpdate = async () => {
		if (isUpdating) {
			return
		}

		setIsUpdating(true)

		try {
			await Updates.fetchUpdateAsync()
			await Updates.reloadAsync()
		} catch {
			setIsUpdating(false)
		}
	}

	return (
		<Modal animationType='fade' transparent visible={isVisible}>
			<View style={styles.overlay}>
				<Pressable style={styles.backdrop} />
				<View style={styles.modal}>
					<Text style={styles.title}>Вышла новая версия</Text>
					<Text style={styles.description}>
						Доступно обновление приложения. Нажмите кнопку ниже, чтобы
						установить его.
					</Text>

					<Button
						disabled={isUpdating}
						onPress={() => {
							void handleUpdate()
						}}
						title={isUpdating ? 'Обновляем...' : 'Обновить'}
					/>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 24,
	},
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(15, 23, 42, 0.55)',
	},
	modal: {
		width: '100%',
		maxWidth: 360,
		borderRadius: 18,
		backgroundColor: '#ffffff',
		padding: 20,
		gap: 16,
	},
	title: {
		fontSize: 22,
		fontWeight: '700',
		color: colors.text,
	},
	description: {
		fontSize: 15,
		lineHeight: 22,
		color: '#475569',
	},
})
