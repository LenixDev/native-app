import { FlatList, KeyboardAvoidingView, Platform, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Button, Description, Input } from 'heroui-native'
import { useState } from 'react'

export default function Tab() {
  const { t, i18n } = useTranslation()
  const [text, setText] = useState('')
  const isRTL = i18n.language === 'ar'
  const conversation = [
    {
      sender: 'human',
      message: 'Hi, I\'m Lenix, and I\'m a Junior Software Developer, and I\'m here asking your assistant',
    },
    {
      sender: 'ai',
      message: 'Hi Lenix, nice to meet you, and I\'m your AI assistant, how can I help you today?',
    },
  ]

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View className="flex h-full justify-end items-center py-5 px-1 gap-4">
        <FlatList
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', padding: 4 }}
          showsVerticalScrollIndicator={false}
          data={conversation}
          keyExtractor={({ sender }, index) => sender + index}
          renderItem={({ item: { sender, message } }) => (
            <View
              className={`${sender === 'human' ? 'bg-muted self-end' : 'bg-border self-start'} px-3 py-2 rounded-lg mb-2 max-w-[98%]`}>
              <Text className={sender === 'human' ? 'text-background' : 'text-muted'}>
                {message}
              </Text>
            </View>
          )}
        />
        <View className={`flex flex-row w-full items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Input
            className="flex-1"
            placeholder={t('placeholder')}
            keyboardType="default"
            autoCapitalize="sentences"
            value={text}
            onChangeText={setText}
          />
          <Button variant='primary'>{t('send')}</Button>
        </View>

        <Description>{t('disclaimer')}</Description>
      </View>
    </KeyboardAvoidingView>
  )
}
