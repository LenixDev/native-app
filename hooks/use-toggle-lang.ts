import type { Lang } from "@/types"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTranslation } from "react-i18next"

export const useToggleLang = () => {
  const { i18n } = useTranslation()
  
  return async () => {
    const next: Lang = i18n.language === 'en' ? 'ar' : 'en'
    await i18n.changeLanguage(next)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await AsyncStorage.setItem('lang', next)
  }
}