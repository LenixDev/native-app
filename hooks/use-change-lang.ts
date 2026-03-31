import type { Lang } from '@/types'
import { useTranslation } from 'react-i18next'

export const useChangeLang = () => {
	const { i18n } = useTranslation()

	return async (lang: Lang) => {
		await i18n.changeLanguage(lang)
	}
}
