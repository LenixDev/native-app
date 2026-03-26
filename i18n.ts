import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'expo-localization'

import en from '@/locales/en.json'
import ar from '@/locales/ar.json'

const deviceLang = getLocales()[0]?.languageCode ?? 'en'

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: deviceLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n