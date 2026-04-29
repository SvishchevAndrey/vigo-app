import { CameraView, useCameraPermissions } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useRef, useState } from 'react'
import {
	Alert,
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native'

import {
	PRODUCT_ROUTES,
	type ProductsStackParamList,
} from '@/shared/routes'
import { colors } from '@/shared/config/theme'
import { Button, PageTitle } from '@/shared/ui'

const MAX_IMAGES = 10

type Props = NativeStackScreenProps<
	ProductsStackParamList,
	typeof PRODUCT_ROUTES.createProduct
>

type ProductImage = {
	fileName?: string | null
	uri: string
}

export function ProductCreateScreen({ navigation }: Props) {
	const cameraRef = useRef<CameraView | null>(null)
	const [cameraPermission, requestCameraPermission] = useCameraPermissions()
	const [images, setImages] = useState<ProductImage[]>([])
	const [isCapturing, setIsCapturing] = useState(false)

	const appendImages = (nextImages: ProductImage[]) => {
		setImages(currentImages => {
			const mergedImages = [...currentImages, ...nextImages]
			return mergedImages.slice(0, MAX_IMAGES)
		})
	}

	const handlePickImages = async () => {
		if (images.length >= MAX_IMAGES) {
			Alert.alert('Лимит фото', `Можно добавить не больше ${MAX_IMAGES} фото.`)
			return
		}

		const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

		if (!permission.granted) {
			Alert.alert(
				'Нет доступа к фото',
				'Разреши доступ к медиатеке, чтобы добавлять изображения товара.'
			)
			return
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: false,
			allowsMultipleSelection: true,
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			quality: 0.8,
			selectionLimit: MAX_IMAGES - images.length,
		})

		if (result.canceled) {
			return
		}

		appendImages(
			result.assets.map(asset => ({
				fileName: asset.fileName,
				uri: asset.uri,
			}))
		)
	}

	const handleTakePhoto = async () => {
		if (images.length >= MAX_IMAGES) {
			Alert.alert('Лимит фото', `Можно добавить не больше ${MAX_IMAGES} фото.`)
			return
		}

		if (!cameraPermission?.granted) {
			const permission = await requestCameraPermission()

			if (!permission.granted) {
				Alert.alert(
					'Нет доступа к камере',
					'Разреши доступ к камере, чтобы фотографировать товары.'
				)
				return
			}
		}

		if (!cameraRef.current || isCapturing) {
			return
		}

		setIsCapturing(true)

		try {
			const photo = await cameraRef.current.takePictureAsync({
				imageType: 'jpg',
				quality: 0.8,
			})

			if (!photo?.uri) {
				return
			}

			appendImages([
				{
					fileName: `photo-${Date.now()}.jpg`,
					uri: photo.uri,
				},
			])
		} catch {
			Alert.alert('Ошибка камеры', 'Не удалось сделать фото. Попробуй еще раз.')
		} finally {
			setIsCapturing(false)
		}
	}

	const handleRemoveImage = (uri: string) => {
		setImages(currentImages => currentImages.filter(image => image.uri !== uri))
	}

	const renderCameraSection = () => {
		if (!cameraPermission) {
			return (
				<View style={styles.cameraPlaceholder}>
					<Text style={styles.cameraTitle}>Подготавливаем камеру...</Text>
				</View>
			)
		}

		if (!cameraPermission.granted) {
			return (
				<View style={styles.cameraPlaceholder}>
					<Text style={styles.cameraTitle}>Нужен доступ к камере</Text>
					<Text style={styles.cameraText}>
						Разреши доступ, и камера будет открываться прямо на этой странице.
					</Text>
					<Button
						onPress={requestCameraPermission}
						style={styles.permissionButton}
						title='Разрешить камеру'
					/>
				</View>
			)
		}

		return (
			<View style={styles.cameraShell}>
				<CameraView facing='back' ref={cameraRef} style={styles.cameraPreview} />
				<View style={styles.cameraOverlay}>
					<Text style={styles.cameraOverlayText}>
						Наведи камеру на товар и сделай снимок
					</Text>
				</View>
			</View>
		)
	}

	return (
		<ScrollView
			contentContainerStyle={styles.content}
			showsVerticalScrollIndicator={false}
		>
			<View style={styles.header}>
				<PageTitle title='Создание продукта' />
				<Text style={styles.description}>
					Камера открыта сразу. Снимай товар и добавляй дополнительные фото из
					галереи.
				</Text>
			</View>

			<View style={styles.section}>
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Камера</Text>
					<Text style={styles.sectionHint}>
						{images.length} из {MAX_IMAGES}
					</Text>
				</View>

				{renderCameraSection()}

				<Button
					disabled={images.length >= MAX_IMAGES || isCapturing}
					onPress={handleTakePhoto}
					style={styles.captureButton}
					title={isCapturing ? 'Сохраняем фото...' : 'Сделать снимок'}
				/>
				<Button
					disabled={images.length >= MAX_IMAGES}
					onPress={handlePickImages}
					style={styles.secondaryButton}
					title={images.length > 0 ? 'Добавить из галереи' : 'Выбрать из галереи'}
				/>
			</View>

			<View style={styles.section}>
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Превью фотографий</Text>
					<Text style={styles.sectionHint}>{images.length} шт.</Text>
				</View>

				{images.length > 0 ? (
					<View style={styles.grid}>
						{images.map(image => (
							<View key={image.uri} style={styles.card}>
								<Image source={{ uri: image.uri }} style={styles.preview} />
								<Pressable
									hitSlop={8}
									onPress={() => handleRemoveImage(image.uri)}
									style={styles.removeButton}
								>
									<Text style={styles.removeButtonText}>×</Text>
								</Pressable>
								<Text numberOfLines={1} style={styles.fileName}>
									{image.fileName ?? 'Фото товара'}
								</Text>
							</View>
						))}
					</View>
				) : (
					<View style={styles.emptyState}>
						<Text style={styles.emptyStateTitle}>Пока нет фотографий</Text>
						<Text style={styles.emptyStateText}>
							Сделай снимок камерой сверху или добавь изображения из галереи.
						</Text>
					</View>
				)}
			</View>

			<Button onPress={() => navigation.goBack()} title='Назад' />
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	content: {
		padding: 16,
		gap: 20,
	},
	header: {
		gap: 8,
	},
	description: {
		fontSize: 16,
		color: colors.text,
		textAlign: 'center',
	},
	section: {
		gap: 12,
		padding: 16,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: '#ffffff',
	},
	sectionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 12,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.text,
	},
	sectionHint: {
		fontSize: 14,
		color: '#64748b',
	},
	cameraShell: {
		overflow: 'hidden',
		borderRadius: 18,
		backgroundColor: '#0f172a',
	},
	cameraPreview: {
		width: '100%',
		aspectRatio: 3 / 4,
	},
	cameraOverlay: {
		position: 'absolute',
		left: 12,
		right: 12,
		bottom: 12,
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderRadius: 12,
		backgroundColor: 'rgba(15, 23, 42, 0.7)',
	},
	cameraOverlayText: {
		fontSize: 14,
		color: '#ffffff',
		textAlign: 'center',
	},
	cameraPlaceholder: {
		gap: 10,
		paddingVertical: 28,
		paddingHorizontal: 16,
		borderRadius: 18,
		backgroundColor: '#eff6ff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	cameraTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.text,
		textAlign: 'center',
	},
	cameraText: {
		fontSize: 14,
		color: '#475569',
		textAlign: 'center',
	},
	permissionButton: {
		alignSelf: 'stretch',
	},
	captureButton: {
		backgroundColor: '#dc2626',
	},
	secondaryButton: {
		backgroundColor: '#0f172a',
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
	},
	card: {
		position: 'relative',
		width: '48%',
		gap: 8,
	},
	preview: {
		width: '100%',
		aspectRatio: 1,
		borderRadius: 14,
		backgroundColor: '#e2e8f0',
	},
	removeButton: {
		position: 'absolute',
		top: 8,
		right: 8,
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: 'rgba(15, 23, 42, 0.8)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	removeButtonText: {
		fontSize: 20,
		lineHeight: 20,
		color: '#ffffff',
	},
	fileName: {
		fontSize: 12,
		color: '#475569',
	},
	emptyState: {
		paddingVertical: 24,
		paddingHorizontal: 16,
		borderRadius: 14,
		backgroundColor: '#eff6ff',
		gap: 4,
	},
	emptyStateTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.text,
	},
	emptyStateText: {
		fontSize: 14,
		color: '#475569',
	},
})
