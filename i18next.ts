import { initReactI18next } from 'react-i18next'
import { use as i18nUse } from 'i18next'
import type { Lang } from '@/types'

import en from './locales/en.json'
import ar from './locales/ar.json'
import es from './locales/es.json'
import { raise } from './lib/utils'

const fallbackLng: Lang = 'en' as const

i18nUse(initReactI18next)
	.init({
		resources: {
			en: { translation: en satisfies typeof ar & typeof es },
			ar: { translation: ar satisfies typeof en & typeof es },
			es: { translation: es satisfies typeof en & typeof ar },
		},
		lng: fallbackLng,
		fallbackLng,
		interpolation: { escapeValue: false },
	})
	.catch(raise)
