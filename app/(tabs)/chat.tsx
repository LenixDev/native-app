import { FlatList, KeyboardAvoidingView, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import {
  Button,
  Description,
  Input,
  Spinner,
  useThemeColor,
  useToast,
} from 'heroui-native'
import { useRef, useState } from 'react'
import type { Conversation } from '@/types'
import Groq from 'groq-sdk'
import { raise } from '@/lib/utils'
import Markdown from 'react-native-markdown-display'

const apiKey = process.env.EXPO_PUBLIC_API_KEY
if (typeof apiKey !== 'string')
  throw new Error('API_KEY environment variable is not defined')

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const groq = new Groq({ apiKey })

// TODO:
// - upload photos,
// - files,
// - voice messages,
// - changemodel,
// - conversations sessions channels,
// - show usage stats, tokens, reequests
// eslint-disable-next-line max-lines-per-function, max-statements
export default function Tab() {
  const { t, i18n } = useTranslation()
  const [content, setContent] = useState('')
  const isRTL = i18n.language === 'ar'
  const [conversation, setConversation] = useState<Conversation[]>([])
  const flatListRef = useRef<FlatList>(null)
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const aiReply = async (racedContent: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const completion = await groq.chat.completions.create({
        messages: [
          ...conversation.map(
            (chat) =>
              ({
                role: chat.role === 'user' ? 'user' : 'assistant',
                content: chat.content,
              }) satisfies Conversation,
          ),
          { role: 'user' as const, content: racedContent },
        ],
        model: 'openai/gpt-oss-120b',
      })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const message = completion.choices[0].message.content
      if (typeof message !== 'string') return
      setConversation((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: message },
      ])
    } catch (err: unknown) {
      setConversation((prev) => prev.slice(0, -1))
      toast.show(String(err))
    }
  }

  const handleSend = async () => {
    if (!content.trim() || loading) return
    setLoading(true)
    const racedContent = content
    setConversation((prev) => [
      ...prev,
      { role: 'user', content: racedContent },
      { role: 'assistant', content: '' },
    ])
    setContent('')

    await aiReply(racedContent)
    setLoading(false)
  }

  const [background, muted] = useThemeColor(['background', 'muted'])

  return (
    <KeyboardAvoidingView className="flex-1" behavior="padding">
      <View className="flex-1 justify-end items-stretch py-5 px-4 gap-4">
        <FlatList
          contentContainerClassName="flex-grow p-1 justify-end"
          ref={flatListRef}
          onContentSizeChange={() =>
            setTimeout(
              () => flatListRef.current?.scrollToEnd({ animated: true }),
              100,
            )
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          data={conversation}
          keyExtractor={({ role }: Conversation, index) => role + index}
          renderItem={({ item: { role, content: text }, index }) => (
            <View
              className={`${role === 'user' ? 'bg-muted self-end' : 'bg-surface self-start'} px-3 py-2 rounded-lg mb-2 max-w-[90%]`}
            >
              {loading &&
              role === 'assistant' &&
              index === conversation.length - 1 ? (
                <Spinner />
              ) : (
                <Markdown
                  style={{
                    body: { color: role === 'user' ? background : muted },
                    paragraph: { marginTop: 0, marginBottom: 0 },
                  }}
                >
                  {text}
                </Markdown>
              )}
            </View>
          )}
        />

        <View
          className={`flex flex-row w-full items-center max-h-2/4 gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <Input
            className="flex-1"
            multiline
            placeholder={t('placeholder')}
            autoCapitalize="sentences"
            submitBehavior="newline"
            value={content}
            onChangeText={setContent}
          />
          <Button
            variant="primary"
            isDisabled={loading}
            onPress={() => {
              handleSend().catch(raise)
            }}
          >
            {t('send')}
          </Button>
        </View>

        <View className="items-center w-full">
          <Description>{t('disclaimer')}</Description>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
