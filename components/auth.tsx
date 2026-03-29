import { IconSymbol } from '@/components/ui/icon-symbol'
import countries from '@/lib/countries.json' with { type: 'json' }
import { flag, raise } from '@/lib/utils'
import { type Href, router } from 'expo-router'
import { Button, FieldError, InputGroup, Separator, useThemeColor, useToast } from 'heroui-native'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Modal, Pressable, Text, View } from 'react-native'
import type { TextInput } from 'react-native-gesture-handler'

type Country = typeof countries

export const Auth = ({
  auth, authLabel, exMethodLabel, exMethod, passwordLength
}: {
  auth: (phone: string, password: string) => Promise<void>
  authLabel: string
  exMethodLabel: string
  exMethod: Href
  passwordLength?: number
}) => {
  const { t } = useTranslation()
  const muted = useThemeColor('muted')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const passwordRef = useRef<TextInput>(null)
  const [{ phone, password, country }, setForm] = useState<{
    phone: string
    password: string
    country: Country[number] | null
  }>({ phone: '', password: '', country: null })
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleAuth = async () => {
    setLoading(true)
    if (typeof country?.dial !== 'string') {
      toast.show(t('unretrievable_country_code'))
      setLoading(false)
      return
    }
    const phoneNumber = `${country.dial}${phone}`
    await auth(phoneNumber, password)
    setLoading(false)
  }
  return (
    <View className="flex justify-evenly items-center h-full px-4">
      <View className="flex-1 flex justify-center">
        <Text className="text-foreground text-5xl">Thrivenix</Text>
      </View>

      <View className="w-full justify-center flex gap-4 flex-1">
        <InputGroup>
          <InputGroup.Prefix className='px-0'>
            <Pressable className='flex-1 w-full px-4 justify-center' onPress={() => { setIsCountryOpen(true); }}>
              {country ? <Text className="text-foreground">
                {`${flag[country.code]} ${country.dial}`}
              </Text>
              : <IconSymbol color={muted} name={`chevron.${isCountryOpen ? 'up' : 'down'}`} size={16} />}
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
            isInvalid={typeof passwordLength === 'number' && password.length > 0 && password.length < passwordLength}
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
        {typeof passwordLength === 'number' && (
          <FieldError className='mb-5' isInvalid={password.length > 0 && password.length < 6}>
            {t('password_short')}
          </FieldError>
        )}
      </View>

      <View className="justify-center w-full">
        <Button
          variant="primary"
          onPress={() => { handleAuth().catch(raise) }}
          isDisabled={loading}
        >
          <Button.Label className="dark:text-background text-foreground">
            {authLabel}
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
            data={countries}
            keyExtractor={countryItem => countryItem.code}
            renderItem={({ item: countryItem }) => (
              <>
                <Pressable
                  className="flex flex-row items-center gap-3 p-4 active:bg-muted"
                  onPress={() => {
                    setForm(form => ({ ...form, country: countryItem }))
                    setIsCountryOpen(false)
                  }}
                >
                  <Text>{flag[countryItem.code]}</Text>
                  <Text className="text-foreground">{countryItem.dial}</Text>
                  <Text className="text-foreground">{countryItem.name}</Text>
                </Pressable>
                <Separator className='w-full h-px' orientation='vertical' />
              </>
            )}
          />
        </View>
      </Modal>

      <View className="w-full flex justify-evenly items-center flex-1">
        <View className="flex flex-row items-center gap-4 w-2/3">
          <Separator className="bg-muted flex-1" />
          <Text className="text-foreground">{t('or')}</Text>
          <Separator className="bg-muted flex-1" />
        </View>
        <Button variant="outline" onPress={() => { router.replace(exMethod) }}>
          <Button.Label className="text-foreground">{exMethodLabel}</Button.Label>
        </Button>
      </View>
    </View>
  )
}