import { useToggleLang } from '@/hooks/use-toggle-lang'
import { supabase } from '@/lib/supabase'
import { raise } from '@/lib/utils'
import { router } from 'expo-router'
import { Button } from 'heroui-native'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

// TODO:
// - theme,
// - lang selection not toggle,
// - change password,
// - change name,
// - change email,
// - delete account,
// - sign out,
// - switch account,
// - UI settings(animation on off, colors, fonts, sizes, dark light mode)
// - logout from selected devices
// - Generate memory from chat history to improve response quality
// - decrease conversation by deleting unused topics in tthe same chat session
// - help
export default function Tab() {
  const { i18n, t } = useTranslation()
  const changeLang = useToggleLang()
  return (
    <View className="flex justify-center h-full">
      <Button
        onPress={() => {
          changeLang().catch(raise)
        }}
      >
        {i18n.language === 'en' ? 'العربية' : 'English'}
      </Button>
      <Button
        onPress={() => {
          supabase.auth
            .signOut()
            .then((res) => {
              router.replace('/signin')
            })
            .catch(raise)
        }}
      >
        {t('signout')}
      </Button>
    </View>
  )
}
