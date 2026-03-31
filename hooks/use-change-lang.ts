import { supabase } from '@/lib/supabase'
import type { Lang } from '@/types'
import { getLocales } from 'expo-localization'
import { useToast } from 'heroui-native/toast'
import { useTranslation } from 'react-i18next'

export const useChangeLang = () => {
	const { i18n } = useTranslation()
	const { toast } = useToast()

	return async (lang: Lang) => {
		const { error: userError, data } = await supabase.auth.getUser()
		if (userError) {
			toast.show(userError.message)
			return false
		}
		const { error } = await supabase.from('accounts').update({ lang }).eq('id', data.user.id)
		if (error) {
			toast.show(error.message)
			return false
		}
		await i18n.changeLanguage(lang === 'system' ? getLocales()[0].languageTag.slice(0, 2) : lang)
		return true
	}
}
