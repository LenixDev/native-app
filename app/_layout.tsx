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
	const [mounted, setMounted] = useState(false)
	const { t, i18n } = useTranslation()

	useEffect(() => {
		supabase.auth.getUser().then(({ data: { user } }) => {
			if (!user) {
				setMounted(true)
				return
			}
			supabase
				.from('accounts')
				.select('lang')
				.eq('id', user.id)
				.single<{ lang: Lang }>()
			.then(({ error: errorLang, data: dataLang }) => {
				if (errorLang) {
					router.replace('/+not-found')
					return
				}
				i18n.changeLanguage(dataLang.lang)
				.then(() => {
					setMounted(true)
				}).catch(raise)
			})
		}).catch(raise)
	}, [i18n])

	if (!i18n.isInitialized) return null
	if (!mounted) return null

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
