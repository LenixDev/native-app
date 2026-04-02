import { supabase } from '@/lib/supabase'
import { raise } from '@/lib/utils'
import type { Lang } from '@/types'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

export default function Tab() {
	const [displayName, setDisplayName] = useState<string | null>(null)
	const { i18n } = useTranslation()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		supabase.auth.getSession().then(({ error, data }) => {
			const name = data.session?.user.user_metadata.display_name
			if (error || typeof name !== 'string' || !data.session) {
				router.replace('/+not-found')
				return
			}
			setDisplayName(name)
			supabase
				.from('accounts')
				.select('lang')
				.eq('id', data.session.user.id)
				.single<{ lang: Lang }>()
				.then(({ error: errorLang, data: dataLang }) => {
					if (errorLang) {
						router.replace('/+not-found')
						return
					}
					i18n.changeLanguage(dataLang.lang).then(() => {
						setMounted(true)
					}).catch(raise)
				})
		}).catch(raise)
	}, [])

	if (!mounted) return null

	return (
		<View className='flex-1 justify-center items-center'>
			<Text className='text-4xl text-foreground'>Hi {displayName}!</Text>
		</View>
	)
}
