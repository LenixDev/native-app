import type { Lang } from '@/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTranslation } from 'react-i18next'

export const useChangeLang = () => {
  const { i18n } = useTranslation()

  return async (lang: Lang) => {
    await i18n.changeLanguage(lang)
    // TODO: Use DB instead
    await AsyncStorage.setItem('lang', lang)
  }
}
