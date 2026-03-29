import { IconSymbol } from '@/components/ui/icon-symbol'
import { flag, raise } from '@/lib/utils'
import { signin } from '@/services/auth'
import { Button, InputGroup, Separator, useThemeColor, useToast } from 'heroui-native'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Modal, Pressable, Text, View } from 'react-native'
import type { TextInput } from 'react-native-gesture-handler'
import countries from '@/lib/countries.json' with { type: 'json' }
import { router } from 'expo-router'

// eslint-disable-next-line max-lines-per-function
const SigninForm = () => {
  const { t } = useTranslation()
  const muted = useThemeColor('muted')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const passwordRef = useRef<TextInput>(null)
  const [{ phone, password, country }, setForm] = useState<{
    phone: string
    password: string
    country: typeof countries[number] | null
  }>({ phone: '', password: '', country: null })
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const { toast } = useToast()

  const handleSignin = async () => {
    const { error } = await signin(`${country?.dial ?? ''}${phone}`, password)
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
    <>
      <View className="w-full justify-center flex gap-4 flex-1">
        <InputGroup>
          <InputGroup.Prefix>
            <Pressable onPress={() => { setIsCountryOpen(true); }}>
              <Text className="text-foreground">
                {country ? `${flag[country.code]} ${country.dial}` : '🌐'}
              </Text>
            </Pressable>
          </InputGroup.Prefix>
          <InputGroup.Input
            onSubmitEditing={() => passwordRef.current?.focus()}
            returnKeyType="next"
            placeholder={t('phone')}
            keyboardType="number-pad"
            value={phone}
            onChangeText={self => { setForm(form => ({ ...form, phone: self })); }}
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
            value={password}
            onChangeText={self => { setForm(form => ({ ...form, password: self })); }}
          />
          <InputGroup.Suffix>
            <Pressable hitSlop={20} onPress={() => { setIsPasswordVisible(visible => !visible); }}>
              <IconSymbol
                size={16}
                name={`eye.${isPasswordVisible ? 'slash.' : ''}fill`}
                color={muted}
              />
            </Pressable>
          </InputGroup.Suffix>
        </InputGroup>
      </View>

      <View className="justify-center w-full">
        <Button variant="primary" onPress={() => { handleSignin().catch(raise) }}>
          <Button.Label className="dark:text-background text-foreground">
            {t('signin')}
          </Button.Label>
        </Button>
      </View>

      <Modal
        visible={isCountryOpen}
        transparent
        animationType="slide"
        onRequestClose={() => { setIsCountryOpen(false); }}
      >
        <Pressable style={{ flex: 1 }} onPress={() => { setIsCountryOpen(false); }} />
        <View className='h-1/2 bg-segment'>
          <FlatList
            data={countries as Country[]}
            keyExtractor={c => c.code}
            renderItem={({ item: c }) => (
              <>
                <Pressable
                  className="flex flex-row items-center gap-3 p-4 active:bg-muted"
                  onPress={() => {
                    setForm(form => ({ ...form, country: c }))
                    setIsCountryOpen(false)
                  }}
                >
                  <Text>{flag[c.code]}</Text>
                  <Text className="text-foreground">{c.dial}</Text>
                  <Text className="text-foreground">{c.name}</Text>
                </Pressable>
                <Separator className='w-full h-px' orientation='vertical' />
              </>
            )}
          />
        </View>
      </Modal>
    </>
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
        <Button variant="outline" onPress={() => { router.replace('/signup') }}>
          <Button.Label className="text-foreground">{t('signup')}</Button.Label>
        </Button>
      </View>
    </View>
  )
}