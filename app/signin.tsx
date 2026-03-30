import { signin } from '@/services/auth'
import { router } from 'expo-router'
import { useToast } from 'heroui-native'
import { Auth } from '../components/auth'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { verificationKey } from '@/constants'

export default function Page() {
  const { t } = useTranslation()
  const { toast } = useToast()

  const auth = async (phone: string, password: string) => {
    const { error } = await signin(phone, password)
    if (error) {
      if (error.code === 'phone_not_confirmed') {
        await AsyncStorage.setItem(verificationKey, phone)
        router.replace('/verify')
        return
      }
      toast.show(error.message)
      return
    }
    toast.show(t('signin_success'))
    router.replace('/(tabs)/home')
  }
  return (
    <Auth
      {...{
        auth,
        authLabel: t('signin'),
        exMethodLabel: t('signup'),
        exMethod: '/signup',
      }}
    />
  )
}
