import { initReactI18next } from 'react-i18next'
import { use as i18nUse } from 'i18next'

import en from './locales/en.json'
import ar from './locales/ar.json'

export const initI18n = async () => {
  await i18nUse(initReactI18next).init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: "end",
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })
}