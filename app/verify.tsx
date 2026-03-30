import { verificationKey } from '@/constants'
import { raise } from '@/lib/utils'
import { verify } from '@/services/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { Button } from 'heroui-native'
import { InputOTP, type InputOTPRef } from 'heroui-native/input-otp'
import { useToast } from 'heroui-native/toast'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Text } from 'react-native'

// eslint-disable-next-line max-lines-per-function
export default function Page() {
  const ref = useRef<InputOTPRef>(null)
  const { toast } = useToast()
  const { t } = useTranslation()

  const [phone, setPhone] = useState<string | null>(null)

  useEffect(() => {
    AsyncStorage.getItem(verificationKey)
      .then((value) => {
        if (typeof value === 'string') setPhone(value)
        else router.replace('/signin')
      })
      .catch(raise)
  }, [])

  if (phone === null) return null

  const onComplete = async (code: string) => {
    const [success, response] = await verify(phone, code)
    if (!success) {
      toast.show(response)
      ref.current?.clear()
      return
    }
    toast.show(t('account_verified'))
    router.replace('/(tabs)/home')
  }
  return (
    <KeyboardAvoidingView
      behavior="padding"
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
          {[0, 1, 2].map((iter) => (
            <InputOTP.Slot key={iter} index={iter} />
          ))}
        </InputOTP.Group>
        <InputOTP.Separator />
        <InputOTP.Group>
          {[3, 4, 5].map((iter) => (
            <InputOTP.Slot key={iter} index={iter} />
          ))}
        </InputOTP.Group>
      </InputOTP>
      <Text className="text-danger max-w-3/4 text-center">
        {t('account_not_verified')}
      </Text>
      <Button
        variant="outline"
        onPress={() => {
          router.replace('/signin')
          AsyncStorage.removeItem(verificationKey).catch(raise)
        }}
      >
        {t('signout')}
      </Button>
    </KeyboardAvoidingView>
  )
}
