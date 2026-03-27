import { Link } from 'expo-router'
import { View } from 'react-native'

// TODO: registeration
export default function Tab() {
  return (
    <View className="flex h-full justify-center items-center">
      <Link href={'./(tabs)/home'} className="text-foreground text-2xl">
        Go to home
      </Link>
    </View>
  )
}