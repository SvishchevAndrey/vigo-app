import { Button, Input, Select, ThemeView } from '@/shared/ui'
import { PageTitle } from '@/shared/ui/page-title'
import { useForm } from 'react-hook-form'
import { StyleSheet } from 'react-native'

const generateOptions = (count: number) => {
	return Array.from({ length: count }, (_, i) => ({
		label: `Опция ${i + 1}`,
		value: `option${i + 1}`,
	}))
}

export function HomeScreen() {
	const { control, handleSubmit } = useForm<{
		name: string
		option: string
	}>({
		defaultValues: {
			name: 'value',
			option: 'option1',
		},
	})

	const onSubmit = handleSubmit(values => {
		console.log('Form values:', values)
	})

	return (
		<ThemeView style={style.container}>
			<PageTitle title='Главная' />
			<Button title='Кнопка' onPress={onSubmit} />
			<Input
				control={control}
				name='name'
				placeholder='Введите текст'
				rules={{ required: 'Введите текст' }}
			/>
			<Select
				control={control}
				name='option'
				placeholder='Выберите опцию'
				options={generateOptions(100)}
				rules={{ required: 'Выберите опцию' }}
			/>
		</ThemeView>
	)
}

const style = StyleSheet.create({
	container: {
		flexDirection: 'column',
		padding: 16,
	},
})
