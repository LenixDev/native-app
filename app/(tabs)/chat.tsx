import { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform, Text } from 'react-native'
import { supabase } from '@/lib/supabase'
import { useToast } from 'heroui-native/toast'
import { Button } from 'heroui-native'

// eslint-disable-next-line max-lines-per-function, max-statements
export default function TabThreeScreen() {
  const [content, setContent] = useState('')
  const [messages, setMessages] = useState<{ id: string; content: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast: { show: toast } } = useToast()

  const fetchMessages = async () => {
    setIsLoading(true)
    const { data } = await supabase.from('messages').select()
    setMessages(data ?? [])
    setIsLoading(false)
  }

  const insert = async () => {
    if (!content.trim()) {
      toast('please add content to the placeholder!')
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
      toast('please add content to the placeholder!')
      return
    }
    const original = messages.find(message => message.id === id)
    if (original?.content === content) {
      toast('can not update with the same content!')
      return
    }
    await supabase.from('messages').update({ content }).eq('id', id)
    await fetchMessages()
    toast('updated!')
  }

  const remove = async (id: string) => {
    await supabase.from('messages').delete().eq('id', id)
    await fetchMessages()
    toast('deleted!')
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex bg-background h-full justify-evenly'
    >
      <Text className='text-foreground'>
        Hi
      </Text>
      <Button onPress={() => { toast('hello') }}>Toast</Button>
    </KeyboardAvoidingView>
  )
}