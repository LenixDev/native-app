import { useThemeColor } from "heroui-native/hooks"
import { useColorScheme } from "./use-color-scheme";
import type { ThemeProvider } from '@react-navigation/native'

export const useTheme = () => {
  const colorScheme = useColorScheme()
  const [primary, background, card, text, border, notification] = useThemeColor([ 'accent', 'background', 'surface', 'foreground', 'border', 'accent' ])
  const theme: Parameters<typeof ThemeProvider>[0]["value"] = {
    dark: colorScheme === 'dark',
    colors: { primary, background, card, text, border, notification },
    fonts: { regular: { fontFamily: 'Inter', fontWeight: '400' }, medium: { fontFamily: 'Inter', fontWeight: '500' }, bold: { fontFamily: 'Inter', fontWeight: '700' }, heavy: { fontFamily: 'Inter', fontWeight: '900' } }
  }
  return theme
}