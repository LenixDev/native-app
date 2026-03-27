import '../global.css'
import 'react-native-reanimated'
import { ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { HeroUINativeProvider } from 'heroui-native'
import '@/i18next'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/hooks/use-theme'

export default function RootLayout() {
  const { i18n } = useTranslation()
  const theme = useTheme()
  
  if (!i18n.isInitialized) return null
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <ThemeProvider value={theme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  )
}