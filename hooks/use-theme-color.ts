/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

export const useThemeColor = (
	props: { light?: string; dark?: string },
	colorName: keyof typeof Colors.light,
) => {
	const theme = useColorScheme() ?? 'light'
	const colorFromProps = props[theme]

	if (typeof colorFromProps === 'string') return colorFromProps

	return Colors[theme][colorName]
}
