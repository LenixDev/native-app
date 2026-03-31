import { Text, View } from 'react-native'
import { supabase } from '@/lib/supabase'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { raise } from '@/lib/utils'

export default function Tab() {
	const [displayName, setDisplayName] = useState<string | null>(null)

	useEffect(() => {
		supabase.auth
			.getUser()
			.then(({ error, data }) => {
				const name = data.user?.user_metadata.display_name
				if (error || typeof name !== 'string') {
					router.replace('/+not-found')
					return
				}
				setDisplayName(name)
			})
			.catch(raise)
	}, [])

	return (
		<View className='flex-1 justify-center items-center'>
			<Text className='text-4xl'>Hi {displayName}!</Text>
		</View>
	)
}
