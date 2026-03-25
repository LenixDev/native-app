import { KeyboardAvoidingView, Platform, Text } from 'react-native'
import { useToast } from 'heroui-native/toast'
import { Button } from 'heroui-native'

// eslint-disable-next-line max-lines-per-function, max-statements
export default function TabThreeScreen() {
  const { toast } = useToast()

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex bg-background h-full justify-evenly'
    >
      <Text className='text-foreground'>
        Hi
      </Text>
      <Button onPress={() => { toast.show('hello') }}>Toast</Button>
    </KeyboardAvoidingView>
  )
}