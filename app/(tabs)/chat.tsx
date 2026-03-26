import { KeyboardAvoidingView, Platform, View, I18nManager } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Button, Description, Input, TextField } from 'heroui-native'
import { useState } from 'react'
import * as Updates from 'expo-updates'
import { changeLanguage } from '@/i18n'

export default function TabThreeScreen() {
  const { t, i18n } = useTranslation()
  const [text, setText] = useState('')
  const isRTL = i18n.language === 'ar'

  const toggleLanguage = async () => {
    const next = i18n.language === 'en' ? 'ar' : 'en'
    await changeLanguage(next)
    I18nManager.forceRTL(next === 'ar')
    if (Platform.OS !== 'web' && !__DEV__) await Updates.reloadAsync()
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View className="flex h-full justify-center items-center w-full my-2">

        <Button onPress={toggleLanguage}>
          {i18n.language === 'en' ? 'العربية' : 'English'}
        </Button>

        <TextField className={`flex flex-row w-full items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Input
            className='flex-1'
            placeholder={t('placeholder')}
            keyboardType="phone-pad"
            autoCapitalize="sentences"
            value={text}
            onChangeText={setText}
          />
          <Button>{t('send')}</Button>
        </TextField>

        <Description>{t('disclaimer')}</Description>
      </View>
    </KeyboardAvoidingView>
  )
}