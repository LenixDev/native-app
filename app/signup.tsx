import { IconSymbol } from '@/components/ui/icon-symbol'
import { raise } from '@/lib/utils'
import { signup } from '@/services/auth'
import { navigate } from 'expo-router/build/global-state/routing'
import { Button, FieldError, InputGroup, Spinner, useThemeColor, useToast } from 'heroui-native'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Text, View } from 'react-native'
import { Pressable, type TextInput } from 'react-native-gesture-handler'

const Signup = ({ phone, password, onPhone, onPassword }: {
  phone: string, password: string,
  onPhone: (phone: string) => void,
  onPassword: (password: string) => void
}) => {
  const muted = useThemeColor('muted')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const passwordRef = useRef<TextInput>(null)
  const { t } = useTranslation()

  return (
    <KeyboardAvoidingView behavior='padding' className="w-full flex-2/4 flex gap-4 justify-center">
      <InputGroup>
        <InputGroup.Prefix isDecorative>
          <IconSymbol color={muted} name="phone.fill" size={16} />
        </InputGroup.Prefix>
        <InputGroup.Input autoCorrect={false} value={phone}
          onSubmitEditing={() => passwordRef.current?.focus()}
          returnKeyType='next'
          placeholder={t("phone")}
          keyboardType='phone-pad'
          autoCapitalize='none'
          onChangeText={onPhone}
        />
      </InputGroup>

      <InputGroup>
        <InputGroup.Prefix isDecorative>
          <IconSymbol color={muted} name="lock.fill" size={16} />
        </InputGroup.Prefix>
        <InputGroup.Input autoCorrect={false} value={password}
          ref={passwordRef}
          returnKeyType='done'
          placeholder={t("password")}
          secureTextEntry={!isPasswordVisible}
          onChangeText={onPassword}
          isInvalid={password.length > 0 && password.length < 6}
        />
        <InputGroup.Suffix>
          <Pressable hitSlop={20} onPress={() => { setIsPasswordVisible(visible => !visible) }}>
            <IconSymbol size={16} name={`eye.${isPasswordVisible ? 'slash.' : ''}fill`} color={muted} />
          </Pressable>
        </InputGroup.Suffix>
      </InputGroup>
      <FieldError isInvalid={password.length > 0 && password.length < 6} >{t("password_short")}</FieldError>
    </KeyboardAvoidingView>
  )
}

export default function Tab() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<boolean | null>(null)
  const [{ phone, password }, setForm] = useState({ phone: '', password: '' })
  const { toast } = useToast()

  const handleRegister = async () => {
    setLoading(true)
    const { error } = await signup(phone, password)
    setLoading(false)
    setResult(!error)
    setTimeout(() => { setResult(null) }, 2000)
    if (error) {
      toast.show(error.message)
      return
    }
    toast.show(t('signup_success'))
    navigate(`/verify?phone=${encodeURIComponent(phone)}`)
  }

  const renderLabel = () => {
    if (loading) return <Spinner color="success" />
    if (result === true) return <IconSymbol color="green" name="checkmark.circle.fill" size={24} />
    if (result === false) return <IconSymbol color="red" name="xmark.circle.fill" size={24} />
    return t("signup")
  }

  return (
    <View className='flex justify-evenly items-center h-full px-4'>
      <View className='flex-1/4 flex justify-center'>
        <Text className='text-foreground text-5xl'>Thrivenix</Text>
      </View>

      <Signup {...{ phone, password }}
        onPassword={(text) => { setForm(prev => ({ ...prev, password: text })) }}
        onPhone={(text) => { setForm(prev => ({ ...prev, phone: text })) }}
      />

      <View className='flex-1/4 justify-center w-full'>
        <Button variant="primary" onPress={() => { handleRegister().catch(raise) }}>
          <Button.Label disabled={loading} className='dark:text-background text-foreground'>
            {renderLabel()}
          </Button.Label>
        </Button>
      </View>
    </View>
  )
}