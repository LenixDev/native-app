import { useTheme } from '@/hooks/use-theme'
import '@/i18next'
import { supabase } from '@/lib/supabase'
import '@/lib/theme'
import { raise } from '@/lib/utils'
import type { Lang } from '@/types'
import { ThemeProvider } from '@react-navigation/native'
import { router, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { HeroUINativeProvider } from 'heroui-native'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import '../global.css'

// eslint-disable-next-line max-lines-per-function
export default function RootLayout() {
	const theme = useTheme()
	const { t, i18n } = useTranslation()

	if (!i18n.isInitialized) return null

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<HeroUINativeProvider>
				<ThemeProvider value={theme}>
					<Stack>
						<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
						<Stack.Screen name='index' options={{ headerShown: false }} />
						<Stack.Screen
							name='signup'
							options={{
								title: t('signup'),
								headerBackTitle: t('signin'),
							}}
						/>
						<Stack.Screen name='signin' options={{ title: t('signin') }} />
						<Stack.Screen name='verify' options={{ title: t('verify') }} />
					</Stack>
					<StatusBar style='auto' />
				</ThemeProvider>
			</HeroUINativeProvider>
		</GestureHandlerRootView>
	)
}
