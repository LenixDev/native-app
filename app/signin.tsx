import { IconSymbol } from '@/components/ui/icon-symbol'
import { raise } from '@/lib/utils'
import { signin } from '@/services/auth'
import {
  Button,
  InputGroup,
  Select,
  Separator,
  useThemeColor,
  useToast,
} from 'heroui-native'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { Pressable, type TextInput } from 'react-native-gesture-handler'
import countries from '@/lib/countries.json' with { type: 'json' }
import { router } from 'expo-router'

// eslint-disable-next-line max-lines-per-function
const SigninForm = () => {
  const { t } = useTranslation()
  const muted = useThemeColor('muted')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const passwordRef = useRef<TextInput>(null)
  const [{ phone, password }, setForm] = useState({ phone: '', password: '' })
  const { toast } = useToast()

  const handleSignin = async () => {
    const { error } = await signin(phone, password)
    if (error) {
      if (error.code === 'phone_not_confirmed')
        router.replace(`/verify?phone=${encodeURIComponent(phone)}`)
      else toast.show(error.message)
      return
    }

    toast.show(t('signin_success'))
    router.replace('/(tabs)/home')
  }

  return (
    <View className="w-full flex gap-4 flex-1">
      <InputGroup>
        {/* <InputGroup.Prefix>
          <Select presentation="bottom-sheet" onValueChange={self => { setForm(form => ({ ...form, code: self?.value ?? '' })) }}>
            <Select.Trigger variant="unstyled" className='flex-row items-center gap-1'>
              <Text className='text-foreground'>{code}</Text>
              <Select.TriggerIndicator />
            </Select.Trigger>
            <Select.Portal>
              <Select.Overlay />
              <Select.Content presentation="bottom-sheet">
                {countries.map(country => (
                  <Select.Item key={country.code} value={country.code} label={`${flag[country.code]} ${country.name}}`} />
                ))}
              </Select.Content>
            </Select.Portal>
          </Select>
        </InputGroup.Prefix> */}
        <InputGroup.Input
          onSubmitEditing={() => passwordRef.current?.focus()}
          returnKeyType="next"
          placeholder={t('phone')}
          keyboardType="phone-pad"
          onChangeText={(self) => {
            setForm((form) => ({ ...form, phone: self }))
          }}
        />
      </InputGroup>
      <InputGroup>
        <InputGroup.Prefix isDecorative>
          <IconSymbol color={muted} name="lock.fill" size={16} />
        </InputGroup.Prefix>
        <InputGroup.Input
          ref={passwordRef}
          returnKeyType="done"
          placeholder={t('password')}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={!isPasswordVisible}
          onChangeText={(self) => {
            setForm((form) => ({ ...form, password: self }))
          }}
        />
        <InputGroup.Suffix>
          <Pressable
            hitSlop={20}
            onPress={() => {
              setIsPasswordVisible(!isPasswordVisible)
            }}
          >
            <IconSymbol
              size={16}
              name={`eye.${isPasswordVisible ? 'slash.' : ''}fill`}
              color={muted}
            />
          </Pressable>
        </InputGroup.Suffix>
      </InputGroup>
      <Button
        variant="primary"
        onPress={() => {
          handleSignin().catch(raise)
        }}
      >
        <Button.Label className="dark:text-background text-foreground">
          {t('signin')}
        </Button.Label>
      </Button>
    </View>
  )
}

export default function Page() {
  const { t } = useTranslation()

  return (
    <View className="flex justify-evenly items-center h-full px-4">
      <View className="flex-1 flex justify-center">
        <Text className="text-foreground text-5xl">Thrivenix</Text>
      </View>

      <SigninForm />

      <View className="w-full flex justify-evenly items-center flex-1">
        <View className="flex flex-row items-center gap-4 w-2/3">
          <Separator className="bg-muted flex-1" />
          <Text className="text-foreground">{t('or')}</Text>
          <Separator className="bg-muted flex-1" />
        </View>
        <Button
          variant="outline"
          onPress={() => {
            router.replace('/signup')
          }}
        >
          <Button.Label className="text-foreground">{t('signup')}</Button.Label>
        </Button>
      </View>
    </View>
  )
}
