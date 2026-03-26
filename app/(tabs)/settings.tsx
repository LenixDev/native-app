import { Button } from 'heroui-native'
import * as Updates from 'expo-updates'
import { I18nManager, View } from 'react-native'
import i18n, { changeLanguage } from '@/i18n'

export default function Tab() {
  const toggleLanguage = async () => {
    const next = i18n.language === 'en' ? 'ar' : 'en'
    await changeLanguage(next)
    I18nManager.forceRTL(next === 'ar')
    await Updates.reloadAsync()
  }
  return (
    <View className="flex justify-center h-full">
      <Button
        onPress={() => {
          toggleLanguage()
        }}
      >
        {i18n.language === 'en' ? 'العربية' : 'English'}
      </Button>
    </View>
  )
}
