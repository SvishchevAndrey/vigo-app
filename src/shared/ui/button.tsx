import { Pressable, StyleSheet, Text, type PressableProps, type StyleProp, type ViewStyle } from 'react-native'

import { colors } from '../config/theme'

type ButtonProps = {
  title: string
  style?: StyleProp<ViewStyle>
} & Omit<PressableProps, 'style'>

export function Button({ title, style, disabled, ...props }: ButtonProps) {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={[styles.button, disabled && styles.buttonDisabled, style]}
    >
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.panelBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  title: {
    color: colors.navText,
    fontSize: 16,
    fontWeight: '600',
  },
})
