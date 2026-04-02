import { router } from 'expo-router'
import { Button } from 'heroui-native'

export default function Tab() {
	return (
		<Button
			onPress={() => {
				router.replace('/signin')
			}}
		>
			Sign in
		</Button>
	)
}
