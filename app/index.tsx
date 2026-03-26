import { Link } from 'expo-router'
import { View } from 'react-native'

const Index = () => (
  <View className='flex h-full justify-center items-center'>
    <Link href={'./(tabs)/home'} className="text-foreground text-2xl">
      Go to home
    </Link>
  </View>
)

export default Index
