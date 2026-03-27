import { initReactI18next } from 'react-i18next'
import { use as i18nUse } from 'i18next'

import en from './locales/en.json'
import ar from './locales/ar.json'

i18nUse(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: "en",
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
}).catch((err: unknown) => { throw new Error(String(err)) });