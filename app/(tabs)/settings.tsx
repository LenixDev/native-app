import { Button } from 'heroui-native'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'

export default function Tab() {
  const { i18n } = useTranslation()
  const toggleLanguage = async () => {
    const next = i18n.language === 'en' ? 'ar' : 'en'
    await i18n.changeLanguage(next)
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
