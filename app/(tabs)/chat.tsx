import { KeyboardAvoidingView, Platform, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Button, Description, Input, TextField } from 'heroui-native'
import { useState } from 'react'

export default function Tab() {
  const { t, i18n } = useTranslation()
  const [text, setText] = useState('')
  const isRTL = i18n.language === 'ar'

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View className="flex h-full justify-center items-center w-full my-2">

        <TextField
          className={`flex flex-row w-full items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
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