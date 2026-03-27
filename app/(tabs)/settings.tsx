import { useToggleLang } from '@/hooks/use-toggle-lang'
import { Button } from 'heroui-native'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

export default function Tab() {
  const { i18n } = useTranslation()
  const changeLang = useToggleLang()
  return (
    <View className="flex justify-center h-full">
      <Button
        onPress={() => {
          changeLang()
        }}
      >
        {i18n.language === 'en' ? 'العربية' : 'English'}
      </Button>
    </View>
  )
}
