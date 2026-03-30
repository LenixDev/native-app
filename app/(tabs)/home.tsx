import { Image } from 'expo-image'
import { StyleSheet } from 'react-native'
import reactLogo from '@/assets/images/partial-react-logo.png'
import { HelloWave } from '@/components/hello-wave'
import ParallaxScrollView from '@/components/parallax-scroll-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { supabase } from '@/lib/supabase'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { raise } from '@/lib/utils'

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: 'absolute',
	},
})

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
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
			headerImage={<Image source={reactLogo} style={styles.reactLogo} />}
		>
			<ThemedView style={styles.titleContainer}>
				<ThemedText type='title'>Hi {displayName}!</ThemedText>
				<HelloWave />
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<ThemedText type='subtitle'>
					Welcome onboard!, this is Thrivenix
				</ThemedText>
			</ThemedView>
		</ParallaxScrollView>
	)
}
