import { useTranslation } from "react-i18next"

export const useRTL = () => {
  const { i18n: { language } } = useTranslation() 
  
  return (classes: string) => language === 'ar' ? classes : ''
}

export const useIsRTL = () => {
  const { i18n: { language } } = useTranslation() 
  return language === 'ar' ? 'rtl' : undefined
}