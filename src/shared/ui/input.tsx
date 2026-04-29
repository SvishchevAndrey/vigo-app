import {
	Controller,
	type Control,
	type FieldPath,
	type FieldValues,
	type RegisterOptions,
} from 'react-hook-form'
import {
	TextInput as NativeTextInput,
	StyleSheet,
	type NativeSyntheticEvent,
	type StyleProp,
	type TextInputFocusEventData,
	type TextInputProps,
	type ViewStyle,
} from 'react-native'

import { colors } from '../config/theme'

type InputProps<TFieldValues extends FieldValues = FieldValues> = {
	containerStyle?: StyleProp<ViewStyle>
	control?: Control<TFieldValues>
	name?: FieldPath<TFieldValues>
	rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>
	defaultValue?: string
} & TextInputProps

type RootInputProps = {
	containerStyle?: StyleProp<ViewStyle>
	onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
} & TextInputProps

function RootInput({ containerStyle, ...props }: RootInputProps) {
	return (
		<NativeTextInput
			{...props}
			placeholderTextColor='#94a3b8'
			style={[styles.input, containerStyle]}
		/>
	)
}

export function Input<TFieldValues extends FieldValues = FieldValues>({
	containerStyle,
	control,
	name,
	rules,
	defaultValue,
	onChangeText,
	onBlur,
	...props
}: InputProps<TFieldValues>) {
	if (!control || !name) {
		return (
			<RootInput
				{...props}
				containerStyle={containerStyle}
				onBlur={onBlur}
				onChangeText={onChangeText}
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
				<RootInput
					{...props}
					containerStyle={containerStyle}
					onBlur={event => {
						field.onBlur()
						onBlur?.(event)
					}}
					onChangeText={text => {
						field.onChange(text)
						onChangeText?.(text)
					}}
					value={
						typeof field.value === 'string'
							? field.value
							: String(field.value ?? '')
					}
				/>
			)}
		/>
	)
}

const styles = StyleSheet.create({
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
})
