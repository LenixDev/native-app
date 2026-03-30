import { initReactI18next } from 'react-i18next'
import { use as i18nUse } from 'i18next'
import { getLocales } from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Lang } from '@/types'

import en from './locales/en.json'
import ar from './locales/ar.json'
import { guard, raise } from './lib/utils'

const supportedLangs: readonly Lang[] = ['en', 'ar']
const fallbackLng: Lang = 'en'

// TODO: make fallback to the user input instetad of hardcoded 'en'
const deviceLang = getLocales()[0].languageCode

const getLang = async () => {
  const saved = await AsyncStorage.getItem('lang')
  if (guard(saved, supportedLangs))
    return saved
  if (guard(deviceLang, supportedLangs))
    return deviceLang
  return fallbackLng
}

;(async () => {
  const lng = await getLang()
  await i18nUse(initReactI18next).init({
    resources: {
      en: { translation: en satisfies typeof ar },
      ar: { translation: ar satisfies typeof en },
    },
    lng,
    fallbackLng,
    interpolation: { escapeValue: false },
  })
})().catch(raise)
