import { initReactI18next } from 'react-i18next'
import { use as i18nUse } from 'i18next'
import { getLocales } from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'

import en from './locales/en.json'
import ar from './locales/ar.json'
type Lang = typeof supportedLangs[number]
const supportedLangs = ['en', 'ar'] as const
const fallbackLng: Lang = 'en'

const deviceLang = getLocales()[0].languageCode
// TODO: make fallback to the user input instetad of hardcoded 'en'
const lng = supportedLangs.find((lang) => lang === deviceLang) ? deviceLang : fallbackLng

const saved = await AsyncStorage.getItem('lang')

i18nUse(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng,
  fallbackLng,
  interpolation: { escapeValue: false },
}).catch((err: unknown) => { throw new Error(String(err)) });

export const changeLang = async (lang: Lang) => {
  await AsyncStorage.setItem('lang', lang)
}