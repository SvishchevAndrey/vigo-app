import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	type StyleProp,
	type ViewStyle,
	View,
} from 'react-native'
import {
	Controller,
	type Control,
	type FieldPath,
	type FieldValues,
	type RegisterOptions,
} from 'react-hook-form'

import { colors } from '../config/theme'

export type SelectOption = {
	label: string
	value: string
}

type SelectProps<TFieldValues extends FieldValues = FieldValues> = {
	options: SelectOption[]
	placeholder?: string
	noOptionsText?: string
	containerStyle?: StyleProp<ViewStyle>
	onSelect?: (option: SelectOption) => void
	value?: string
	onValueChange?: (value: string) => void
	control?: Control<TFieldValues>
	name?: FieldPath<TFieldValues>
	rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>
	defaultValue?: string
}

type RootSelectProps = {
	options: SelectOption[]
	placeholder: string
	noOptionsText: string
	containerStyle?: StyleProp<ViewStyle>
	onSelect?: (option: SelectOption) => void
	value?: string
	onValueChange?: (value: string) => void
	onBlur?: () => void
}

function RootSelect({
	options,
	placeholder,
	noOptionsText,
	containerStyle,
	onSelect,
	value,
	onValueChange,
	onBlur,
}: RootSelectProps) {
	const [query, setQuery] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const [dropdownPosition, setDropdownPosition] = useState<{
		top: number
		left: number
		width: number
	} | null>(null)
	const inputWrapperRef = useRef<View>(null)

	const selectedOption = options.find(option => option.value === value)

	const closeDropdown = useCallback(() => {
		setIsOpen(false)
	}, [])

	const syncDropdownPosition = useCallback(() => {
		inputWrapperRef.current?.measureInWindow((x, y, width, height) => {
			setDropdownPosition({
				top: y + height + 4,
				left: x,
				width,
			})
		})
	}, [])

	const openDropdown = useCallback(() => {
		syncDropdownPosition()
		setIsOpen(true)
	}, [syncDropdownPosition])

	useEffect(() => {
		if (!isOpen) {
			setQuery(selectedOption?.label ?? '')
		}
	}, [isOpen, selectedOption])

	useEffect(() => {
		if (isOpen) {
			syncDropdownPosition()
		}
	}, [isOpen, syncDropdownPosition])

	const filteredOptions = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase()

		if (!normalizedQuery) {
			return options
		}

		return options.filter(option =>
			option.label.toLowerCase().includes(normalizedQuery),
		)
	}, [options, query])

	const handleSelect = (option: SelectOption) => {
		setQuery(option.label)
		closeDropdown()
		onValueChange?.(option.value)
		onSelect?.(option)
	}

	return (
		<View style={[styles.container, containerStyle]}>
			<View ref={inputWrapperRef}>
				<TextInput
					value={query}
					placeholder={placeholder}
					placeholderTextColor='#94a3b8'
					onFocus={openDropdown}
					onChangeText={text => {
						setQuery(text)
						openDropdown()

						if (!text.trim() || text !== selectedOption?.label) {
							onValueChange?.('')
						}
					}}
					onBlur={() => {
						setTimeout(closeDropdown, 120)
						onBlur?.()
					}}
					style={styles.input}
				/>
			</View>

			{isOpen && dropdownPosition && (
				<Modal
					transparent
					animationType='none'
					onRequestClose={closeDropdown}
					visible={isOpen}
				>
					<View style={styles.modalRoot}>
						<Pressable style={styles.backdrop} onPress={closeDropdown} />
						<View
							style={[
								styles.dropdown,
								{
									top: dropdownPosition.top,
									left: dropdownPosition.left,
									width: dropdownPosition.width,
								},
							]}
						>
							{filteredOptions.length > 0 ? (
								<ScrollView
									keyboardShouldPersistTaps='handled'
									showsVerticalScrollIndicator={false}
								>
									{filteredOptions.map(option => (
										<Pressable
											key={option.value}
											style={styles.option}
											onPress={() => handleSelect(option)}
										>
											<Text style={styles.optionText}>{option.label}</Text>
										</Pressable>
									))}
								</ScrollView>
							) : (
								<View style={styles.emptyState}>
									<Text style={styles.emptyStateText}>{noOptionsText}</Text>
								</View>
							)}
						</View>
					</View>
				</Modal>
			)}
		</View>
	)
}

export function Select<TFieldValues extends FieldValues = FieldValues>({
	options,
	placeholder = 'Выберите значение',
	noOptionsText = 'Ничего не найдено',
	containerStyle,
	onSelect,
	value,
	onValueChange,
	control,
	name,
	rules,
	defaultValue,
}: SelectProps<TFieldValues>) {
	if (!control || !name) {
		return (
			<RootSelect
				containerStyle={containerStyle}
				noOptionsText={noOptionsText}
				onSelect={onSelect}
				onValueChange={onValueChange}
				options={options}
				placeholder={placeholder}
				value={value}
			/>
		)
	}

	return (
		<Controller
			control={control}
			defaultValue={defaultValue as never}
			name={name}
			rules={rules}
			render={({ field }) => (
				<RootSelect
					containerStyle={containerStyle}
					noOptionsText={noOptionsText}
					onBlur={field.onBlur}
					onSelect={onSelect}
					onValueChange={nextValue => {
						field.onChange(nextValue)
						onValueChange?.(nextValue)
					}}
					options={options}
					placeholder={placeholder}
					value={typeof field.value === 'string' ? field.value : ''}
				/>
			)}
		/>
	)
}

const styles = StyleSheet.create({
	container: {
		zIndex: 1,
	},
	modalRoot: {
		flex: 1,
	},
	backdrop: {
		...StyleSheet.absoluteFillObject,
	},
	input: {
		minHeight: 44,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		backgroundColor: '#ffffff',
		color: colors.text,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 16,
	},
	dropdown: {
		position: 'absolute',
		zIndex: 30,
		maxHeight: 220,
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		overflow: 'hidden',
	},
	option: {
		minHeight: 44,
		paddingHorizontal: 12,
		justifyContent: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#e2e8f0',
	},
	optionText: {
		color: colors.text,
		fontSize: 15,
	},
	emptyState: {
		minHeight: 44,
		paddingHorizontal: 12,
		justifyContent: 'center',
	},
	emptyStateText: {
		color: '#64748b',
		fontSize: 14,
	},
})
