import { IconSymbol } from '@/components/ui/icon-symbol'
import { supabase } from '@/lib/supabase'
import { raise } from '@/lib/utils'
import { Button, InputGroup, Spinner, useThemeColor } from 'heroui-native'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Text, View } from 'react-native'
import { Pressable, type TextInput } from 'react-native-gesture-handler'

// TODO: registration
// eslint-disable-next-line max-lines-per-function
export default function Tab() {
  const muted = useThemeColor('muted')
  const { t } = useTranslation()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const passwordRef = useRef<TextInput>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<boolean | null>(null)
  const [{ phone, password }, setForm] = useState({ phone: '', password: '' })

  const handleRegister = () => {
    setLoading(true)
    supabase.auth.signUp({ phone, password })
      .then(({ error, data }) => {
        setLoading(false)
        setResult(!error)
        setTimeout(() => { setResult(null) }, 2000)
      })
      .catch(raise)
  }

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
            value={phone}
            onChangeText={(text) => { setForm(prev => ({ ...prev, phone: text })) }}
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
            value={password}
            onChangeText={(text) => { setForm(prev => ({ ...prev, password: text })) }}
          />
          <InputGroup.Suffix>
            <Pressable hitSlop={20} onPress={() => { setIsPasswordVisible(visible => !visible) }}>
              <IconSymbol size={16} name={`eye.${isPasswordVisible ? 'slash.' : ''}fill`} color={muted} />
            </Pressable>
          </InputGroup.Suffix>
        </InputGroup>
      </KeyboardAvoidingView>

      <View className='flex-1/4 justify-center w-full'>
        <Button variant="primary" onPress={handleRegister}>
          <Button.Label disabled={loading} className='dark:text-background text-foreground'>
            {/* eslint-disable-next-line no-nested-ternary */}
            {loading
              ? <Spinner color="success" />
              : result === true
                ? <IconSymbol color="green" name="checkmark.circle.fill" size={24} />
                : result === false
                  ? <IconSymbol color="red" name="xmark.circle.fill" size={24} />
                  : t("register")
            }
          </Button.Label>
        </Button>
      </View>
    </View>
  )
}