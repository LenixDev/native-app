import { IconSymbol } from '@/components/ui/icon-symbol'
import { supabase } from '@/lib/supabase'
import { raise } from '@/lib/utils'
import { Redirect } from 'expo-router'
import { navigate } from 'expo-router/build/global-state/routing'
import { Button, InputGroup, Separator, useThemeColor } from 'heroui-native'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { Pressable, type TextInput } from 'react-native-gesture-handler'

// TODO: registeration
// eslint-disable-next-line max-lines-per-function
export default function Page() {
  const muted = useThemeColor('muted')
  const { t } = useTranslation()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordRef = useRef<TextInput>(null)
  const [{ phone, password }, setForm] = useState({ phone: '', password: '' })

  const login = () => {
    supabase.auth.signInWithPassword({ phone, password })
    .then(({ error, data }) => {
      console.log(error, data)
    }).catch(raise)
  }

  // return <Redirect href="/(tabs)/home" />

  return (
    <View className='flex justify-evenly items-center h-full px-4'>
      <View className='flex-1 flex justify-center'>
        <Text className='text-foreground text-5xl'>Thrivenix</Text>
      </View>
      <View className="w-full flex gap-4 flex-1">
        <InputGroup>
          <InputGroup.Prefix isDecorative>
            <IconSymbol color={muted} name="phone.fill" size={16} />
          </InputGroup.Prefix>
          <InputGroup.Input
            onSubmitEditing={() => passwordRef.current?.focus()}
            returnKeyType='next'
            placeholder={t("phone")}
            keyboardType='phone-pad'
            onChangeText={self => { setForm(form => ({ ...form, phone: self })); }}
          />
        </InputGroup>
        <InputGroup>
          <InputGroup.Prefix isDecorative>
            <IconSymbol color={muted} name="lock.fill" size={16} />
          </InputGroup.Prefix>
          <InputGroup.Input
            ref={passwordRef}
            returnKeyType='done'
            placeholder={t("password")}
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={!isPasswordVisible}
            onChangeText={self => { setForm(form => ({ ...form, password: self })); }}
          />
          <InputGroup.Suffix>
            <Pressable hitSlop={20}
              onPress={() => { setIsPasswordVisible(!isPasswordVisible) }}
            >
              <IconSymbol size={16} name={`eye.${isPasswordVisible ? 'slash.' : ''}fill`} color={muted} />
            </Pressable>
          </InputGroup.Suffix>
        </InputGroup>
        <Button variant="primary" onPress={login}>
          <Button.Label className='dark:text-background text-foreground'>{t("login")}</Button.Label>
        </Button>
      </View>
      <View className='w-full flex justify-evenly items-center flex-1'>
        <View className='flex flex-row items-center gap-4 w-2/3'>
          <Separator className='bg-muted flex-1' />
          <Text className='text-foreground'>{t("or")}</Text>
          <Separator className='bg-muted flex-1' />
        </View>
        <Button variant="outline" onPress={() => { navigate('/register') }}>
          <Button.Label className='text-foreground'>{t("register")}</Button.Label>
        </Button>
      </View>
    </View>
  )
}