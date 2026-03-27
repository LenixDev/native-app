import { FlatList, KeyboardAvoidingView, Platform, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Button, Description, Input, Spinner, useToast } from 'heroui-native'
import { useRef, useState } from 'react'
import type { Conversation } from '@/types'
import Groq from "groq-sdk"
import { raise } from '@/lib/utils'

const apiKey = process.env.EXPO_PUBLIC_API_KEY
if (typeof apiKey !== 'string') throw new Error('API_KEY environment variable is not defined')

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const groq = new Groq({ apiKey })

// eslint-disable-next-line max-lines-per-function
export default function Tab() {
  const { t, i18n } = useTranslation()
  const [text, setText] = useState('')
  const isRTL = i18n.language === 'ar'
  const [conversation, setConversation] = useState<Conversation[]>([])
  const flatListRef = useRef<FlatList>(null)
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const aiReply = async (content: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const completion = await groq.chat.completions.create({
        messages: [
          ...conversation.map(chat => ({
            role: chat.role === 'user' ? 'user' : 'assistant',
            content: chat.message,
          } satisfies Conversation)),
          { role: 'user' as const, content },
        ],
        model: "openai/gpt-oss-120b",
      })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const message = completion.choices[0].message.content
      if (typeof message !== 'string') {
        toast.show("something went wrong")
        return
      }
      setConversation(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', message },
      ])
      
    } catch (err: unknown) {
      toast.show(String(err))
    }
  }

  const handleSend = async () => {
    if (!text.trim() || loading) return
    setLoading(true)
    const content = text
    setConversation(prev => [
      ...prev,
      { role: 'user', message: text },
      { role: 'assistant', message: '' },
    ])
    setText('')
    
    await aiReply(content)
    setLoading(false)
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View className="flex h-full justify-end items-stretch py-5 px-1 gap-4">

        <FlatList
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', padding: 4 }}
          ref={flatListRef}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          data={conversation}
          keyExtractor={({ role }: Conversation, index) => role + index}
          renderItem={({ item: { role, message }, index }) => (
            <View
              className={`${role === 'user' ? 'bg-muted self-end' : 'bg-surface self-start'} px-3 py-2 rounded-lg mb-2 max-w-[95%]`}>
              {loading && role === 'assistant' && index === conversation.length - 1
                ? (
                  <Spinner>
                    <Spinner.Indicator>
                      <Text>⏳</Text>
                    </Spinner.Indicator>
                  </Spinner>
                )
                : <Text className={role === 'user' ? 'text-background' : 'text-muted'}>{message}</Text>
              }
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
          <Button variant='primary' isDisabled={loading} onPress={() => {
              handleSend().catch(raise)
            }}
          >{t('send')}</Button>
        </View>

        <View className="items-center w-full">
          <Description>{t('disclaimer')}</Description>
        </View>

      </View>
    </KeyboardAvoidingView>
  )
}
