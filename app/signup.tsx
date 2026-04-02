import { router } from 'expo-router'
import { useToast } from 'heroui-native'
import { useTranslation } from 'react-i18next'
import { Auth } from '@/components/auth'
import { supabase } from '@/lib/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { verificationKey } from '@/constants'

export default function Page() {
	const { t } = useTranslation()
	const { toast } = useToast()

	const auth = async (phone: string, password: string, name?: string) => {
		if (typeof name !== 'string') {
			toast.show(`expected string, got ${typeof name} at #3`)
			return
		}

		const { error } = await supabase.auth.signUp({
			phone,
			password,
			options: { data: { display_name: name } },
		})
		if (error) {
			toast.show(error.message)
			return
		}
		await AsyncStorage.setItem(verificationKey, phone)
		toast.show(t('signup_success'))
		router.replace('/verify')
	}

	return (
		<Auth
			{...{
				auth,
				authLabel: t('signup'),
				exMethodLabel: t('signin'),
				exMethod: '/signin',
			}}
		/>
	)
}
