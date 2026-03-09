import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native'
import { supabase } from '@/lib/supabase'
import { TextInput, IconButton, useTheme, ActivityIndicator } from 'react-native-paper'
import { useSnackbar } from '@/hooks/use-snackbar'

export default function TabThreeScreen() {
  const [content, setContent] = useState('')
  const [messages, setMessages] = useState<{ id: string; content: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { colors } = useTheme()
  const notify = useSnackbar()

  useEffect(() => { fetchMessages() }, [])

  async function fetchMessages() {
    setIsLoading(true)
    const { data } = await supabase.from('messages').select()
    setMessages(data ?? [])
    setIsLoading(false)
  }

  async function insert() {
    if (!content.trim()) return notify('please add content to the placeholder!')
    await supabase.from('messages').insert({ content, user_id: '00000000-0000-0000-0000-000000000000' })
    setContent('')
    fetchMessages()
  }

  async function update(id: string) {
    if (!content.trim()) return notify('please add content to the placeholder!')
    const original = messages.find(m => m.id === id)
    if (original?.content === content) return notify('can not update with the same content!')
    await supabase.from('messages').update({ content }).eq('id', id)
    fetchMessages()
    notify('updated!')
  }

  async function remove(id: string) {
    await supabase.from('messages').delete().eq('id', id)
    fetchMessages()
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isLoading
          ? <ActivityIndicator animating color={colors.primary} style={{ marginTop: 40 }} />
          : messages.map(m => (
            <View key={m.id} style={styles.bubble}>
              <Text style={styles.messageText}>{m.content}</Text>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => update(m.id)}>
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => remove(m.id)}>
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
        <IconButton icon="send" onPress={insert} />
      </View>
    </KeyboardAvoidingView>
  )
}