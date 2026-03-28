import { IconSymbol } from '@/components/ui/icon-symbol'
import { Redirect } from 'expo-router'
import { navigate } from 'expo-router/build/global-state/routing'
import { Button, InputGroup, Separator, useThemeColor } from 'heroui-native'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Text, View } from 'react-native'
import { Pressable, type TextInput } from 'react-native-gesture-handler'

// TODO: registeration
// eslint-disable-next-line max-lines-per-function
export default function Tab() {
  const muted = useThemeColor('muted')
  const { t } = useTranslation()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordRef = useRef<TextInput>(null)

  // return <Redirect href="/(tabs)/home" />

  return (
    <View className='flex justify-evenly items-center h-full px-4'>
      <View className='flex-1/4 flex justify-center'>
        <Text className='text-foreground text-5xl'>Thrivenix</Text>
      </View>
      <KeyboardAvoidingView behavior='padding' className="w-full flex-2/4 flex gap-4 justify-center">
          <InputGroup>
            <InputGroup.Prefix isDecorative>
              <IconSymbol color={muted} name="phone.fill" size={16} />
            </InputGroup.Prefix>
            <InputGroup.Input
              onSubmitEditing={() => passwordRef.current?.focus()}
              returnKeyType='next'
              placeholder={t("phone")}
              keyboardType='phone-pad'
              autoCapitalize='none'
              autoCorrect={false}
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
            />
            <InputGroup.Suffix>
              <Pressable hitSlop={20}
                onPress={() => { setIsPasswordVisible(!isPasswordVisible) }}
              >
                <IconSymbol size={16} name={`eye.${isPasswordVisible ? 'slash.' : ''}fill`} color={muted} />
              </Pressable>
            </InputGroup.Suffix>
          </InputGroup>
      </KeyboardAvoidingView>
      <View className='flex-1/4 justify-center w-full'>
        <Button variant="primary">
          <Button.Label className='dark:text-background text-foreground'>{t("register")}</Button.Label>
        </Button>
      </View>
    </View>
  )
}