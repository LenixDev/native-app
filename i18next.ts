import { initReactI18next } from 'react-i18next'
import { use as i18nUse } from 'i18next'
import { getLocales } from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Lang } from '@/types'

import en from './locales/en.json'
import ar from './locales/ar.json'

const supportedLangs: Set<Lang> = new Set<Lang>(['en', 'ar'])
const fallbackLng: Lang = 'en'

const deviceLang = getLocales()[0].languageCode
// TODO: make fallback to the user input instetad of hardcoded 'en'
const lng = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const saved = await AsyncStorage.getItem('lang')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  if (supportedLangs.has(saved as Lang))
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return saved as Lang
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  if (supportedLangs.has(deviceLang as Lang))
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return deviceLang as Lang
  return fallbackLng
}


i18nUse(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: await lng(),
  fallbackLng,
  interpolation: { escapeValue: false },
}).catch((err: unknown) => { throw new Error(String(err)) });