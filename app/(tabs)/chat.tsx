import { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native'
import { supabase } from '@/lib/supabase'
import { TextInput, useTheme, ActivityIndicator } from 'react-native-paper'
import { useSnackbar } from '@/hooks/use-snackbar'
import { Button } from 'heroui-native/button'

// eslint-disable-next-line max-lines-per-function, max-statements
export default function TabThreeScreen() {
  const [content, setContent] = useState('')
  const [messages, setMessages] = useState<{ id: string; content: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { colors } = useTheme()
  const notify = useSnackbar()
  const scrollRef = useRef<ScrollView>(null)

  const fetchMessages = async () => {
    setIsLoading(true)
    const { data } = await supabase.from('messages').select()
    setMessages(data ?? [])
    setIsLoading(false)
  }

  const insert = async () => {
    if (!content.trim()) {
      notify('please add content to the placeholder!')
      return 
    }
    await supabase.from('messages').insert({ content, user_id: '00000000-0000-0000-0000-000000000000' })
    setContent('')
    await fetchMessages()
  }

  useEffect(() => {
    fetchMessages().catch(() => { throw new Error("An error occur inside a useEffect") })
  }, [])

  const update = async (id: string) => {
    if (!content.trim()) {
      notify('please add content to the placeholder!')
      return
    }
    const original = messages.find(message => message.id === id)
    if (original?.content === content) {
      notify('can not update with the same content!')
      return
    }
    await supabase.from('messages').update({ content }).eq('id', id)
    await fetchMessages()
    notify('updated!')
  }

  const remove = async (id: string) => {
    await supabase.from('messages').delete().eq('id', id)
    await fetchMessages()
    notify('deleted!')
  }

  const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    scrollContent: { padding: 12, gap: 8, flexGrow: 1, justifyContent: 'flex-end' },
    bubble: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      padding: 12,
      gap: 8,
    },
    messageText: { color: colors.onSurface, fontSize: 15 },
    actions: { flexDirection: 'row', gap: 8 },
    actionBtn: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
      backgroundColor: colors.secondaryContainer,
    },
    actionText: { color: colors.onSecondaryContainer, fontSize: 12 },
    deleteBtn: { backgroundColor: colors.errorContainer },
    deleteText: { color: colors.onErrorContainer, fontSize: 12 },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.outline,
      backgroundColor: colors.background,
    },
  })

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} ref={scrollRef} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
        {isLoading
          ? <ActivityIndicator animating color={colors.primary} style={{ marginTop: 40 }} />
          : messages.map(message => (
            <View key={message.id} style={styles.bubble}>
              <Text style={styles.messageText}>{message.content}</Text>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => { update(message.id).catch(() => undefined) }}>
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => { remove(message.id).catch(() => undefined) }}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        }
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput
          style={{ flex: 1 }}
          value={content}
          onChangeText={setContent}
          placeholder="Message"
          mode="outlined"
          dense
        />
        <Button onPress={() => { insert().catch(() => undefined) }}>Send</Button>
      </View>
    </KeyboardAvoidingView>
  )
}