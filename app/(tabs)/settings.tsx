import { Button } from 'heroui-native'
import * as Updates from 'expo-updates'
import i18n, { changeLanguage } from '@/i18n'
import { I18nManager } from 'react-native'
import { Platform } from 'react-native'

export default function Tab() {
  const toggleLanguage = async () => {
    const next = i18n.language === 'en' ? 'ar' : 'en'
    await changeLanguage(next)
    I18nManager.forceRTL(next === 'ar')
    if (Platform.OS !== 'web' && !__DEV__) await Updates.reloadAsync()
  }
  return (
    <Button
      onPress={() => {
        toggleLanguage().catch(() => undefined)
      }}
    >
      {i18n.language === 'en' ? 'العربية' : 'English'}
    </Button>
  )
}
