import { verificationKey } from '@/constants'
import { raise } from '@/lib/utils'
import { verify } from '@/services/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { useLocalSearchParams } from 'expo-router/build/hooks'
import { Button } from 'heroui-native'
import { InputOTP, type InputOTPRef } from 'heroui-native/input-otp'
import { LinkButton } from 'heroui-native/link-button'
import { useToast } from 'heroui-native/toast'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Text } from 'react-native'

// eslint-disable-next-line max-lines-per-function
export default function Page() {
  const ref = useRef<InputOTPRef>(null)
  const { toast } = useToast()
  const  { t } = useTranslation()

  const { phone } = useLocalSearchParams()
  if (typeof phone !== 'string') {
    router.replace('/signin')
    return null
  }

  const onComplete = async (code: string) => {
    const [success, response] = await verify(phone, code)
    if (!success) {
      toast.show(response)
      ref.current?.clear()
      return
    }
    toast.show(t("account_verified"))
    router.replace('/(tabs)/home')
  }
  return (
    <KeyboardAvoidingView behavior="padding"
      className="flex items-center justify-evenly w-full h-full"
    >
      <InputOTP
        ref={ref}
        maxLength={6}
        onComplete={(self) => {
          onComplete(self).catch(raise)
        }}
      >
        <InputOTP.Group>
          <InputOTP.Slot index={0} />
          <InputOTP.Slot index={1} />
          <InputOTP.Slot index={2} />
        </InputOTP.Group>
        <InputOTP.Separator />
        <InputOTP.Group>
          <InputOTP.Slot index={3} />
          <InputOTP.Slot index={4} />
          <InputOTP.Slot index={5} />
        </InputOTP.Group>
      </InputOTP>
      <Text className='text-danger max-w-3/4 text-center'>{t("account_not_verified")}</Text>
      <Button variant='outline' onPress={() => {
        router.replace('/signin')
        AsyncStorage.removeItem(verificationKey).catch(raise)
      }}>{t("signout")}</Button>
    </KeyboardAvoidingView>
  )
}
