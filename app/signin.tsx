import { router } from 'expo-router'
import { useToast } from 'heroui-native'
import { Auth } from '@/components/auth'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { verificationKey } from '@/constants'
import { supabase } from '@/lib/supabase'
import type { Lang } from '@/types'

export default function Page() {
	const { t, i18n } = useTranslation()
	const { toast } = useToast()

	const auth = async (phone: string, password: string) => {
		const { error, data } = await supabase.auth.signInWithPassword({
			phone,
			password,
		})
		if (error) {
			if (error.code === 'phone_not_confirmed') {
				await AsyncStorage.setItem(verificationKey, phone)
				router.replace('/verify')
				return
			}
			toast.show(error.message)
			return
		}
		const { error: accountError, data: account } = await supabase
			.from('accounts')
			.select('lang')
			.eq('id', data.user.id)
			.single<{ lang: Lang }>()
		if (accountError) toast.show(accountError.message)
		else await i18n.changeLanguage(account.lang)
		toast.show(t('signin_success'))
		router.replace('/(tabs)/home')
	}
	return (
		<Auth
			{...{
				auth,
				authLabel: t('signin'),
				exMethodLabel: t('signup'),
				exMethod: '/signup',
			}}
		/>
	)
}
