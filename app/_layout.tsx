import '../global.css'
import { I18nManager } from 'react-native'
import 'react-native-reanimated'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { HeroUINativeProvider } from 'heroui-native'
import { useEffect } from 'react'
import { initI18n } from '@/i18n'
import { useTranslation } from 'react-i18next'

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const { i18n, ready } = useTranslation()

  useEffect(() => {
    initI18n()
      .then(() => {
        I18nManager.forceRTL(i18n.language === 'ar')
      })
      .catch((err: unknown) => {
        throw new Error(String(err))
      })
  }, [])

  if (!ready) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  )
}