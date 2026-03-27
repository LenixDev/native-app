import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'expo-localization'
import * as SecureStore from 'expo-secure-store'

import en from './locales/en.json'
import ar from './locales/ar.json'

const deviceLang = getLocales()[0].languageCode ?? 'en'
const supportedLangs = ['en', 'ar']

export const initI18n = async () => {
  const saved = await SecureStore.getItemAsync('lang')
  const lng = saved && supportedLangs.includes(saved) ? saved : deviceLang

  await i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })
}

export const changeLanguage = async (lang: string) => {
  await SecureStore.setItemAsync('lang', lang)
  await i18n.changeLanguage(lang)
}

export default i18n
