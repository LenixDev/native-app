import { deviceLang } from '@/i18next'
import { supabase } from '@/lib/supabase'
import type { Lang } from '@/types'
import { useToast } from 'heroui-native/toast'
import { useTranslation } from 'react-i18next'

export const useChangeLang = () => {
	const { i18n } = useTranslation()
	const { toast } = useToast()

	return async (lang: Lang) => {
		const { error } = await supabase.from('accounts').update({ lang })
		if (error) {
			toast.show(error.message)
			return false
		}
		await i18n.changeLanguage(lang === 'system' ? deviceLang() : lang)
		return true
	}
}
