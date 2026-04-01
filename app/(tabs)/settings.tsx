import { Appearance } from '@/components/appearance'
import { BottomModal } from '@/components/bottom-modal'
import { ListItem } from '@/components/list-item'
import { useRTL } from '@/hooks/use-rtl'
import { supabase } from '@/lib/supabase'
import { raise } from '@/lib/utils'
import { signout } from '@/services/auth'
import { router } from 'expo-router'
import {
	Avatar,
	Button,
	Description,
	ListGroup,
	Separator,
	useToast,
} from 'heroui-native'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

// Faq accordittion

// Chat avatart

// Other settings checkbox
// Controlfield
// Switch
// Menu
// Radio

// Scroll shadow chat
// Surface chat

// TODO:
// - Generate memory from chat history to improve response quality
// - decrease conversation by deleting unused topics in tthe same chat session
// - help
// - profile

// eslint-disable-next-line max-lines-per-function
export default function Tab() {
	const { t } = useTranslation()
	const { toast } = useToast()
	const [open, setOpen] = useState(false)
	const rtl = useRTL()
	const [name, setName] = useState('')

	const handleSignout = () => {
		signout()
		.then(([success, response]) => {
			if (!success) {
				toast.show(response)
				return
			}
			router.replace('/signin')
			toast.show(t('signout_success'))
		})
		.catch(raise)
	}

	useEffect(() => {
		supabase.auth.getUser().then(({ error, data }) => {
			if (error) {
				toast.show(error.message)
				return
			}
			setName(data.user.user_metadata.display_name)
		}).catch(raise)
	})

	if (name.trim() === '') return null
	
	const avatarFromName = () => {
		const words = name.trim().split(/\s+/)
		if (words.length === 1) return words[0][0]
		return `${words[0][0]} ${words[1][0]}`
	}

	return (
		<View className='flex justify-between h-full p-5'>
			<View className={`flex-1 py-10 flex-row${rtl('-reverse')} justify-between`}>
				<View className={rtl('flex items-end')}>
					<Text className='text-4xl text-foreground'>{t('preferences')}</Text>
					<Description>{t('manage_preferences')}</Description>
				</View>
				<View>
					<Avatar color="accent" alt='account-avatar'>
					<Avatar.Fallback
						textProps={{ style: { fontSize: 24, lineHeight: 32 } }}
						styles={{ container: { justifyContent: 'center', alignItems: 'center', paddingBottom: 0, marginBottom: 0 } }}
					>{avatarFromName()}</Avatar.Fallback>
					</Avatar>
				</View>
			</View>

			<ListGroup className='flex-2 p-0'>
				<ListItem
					icon='person'
					title={t('account')}
					context={t('account_context')}
				/>
				<Separator className='mx-4' />
				<ListItem
					onPress={() => {
						setOpen(true)
					}}
					icon='pencil'
					title={t('appearance')}
					context={t('appearance_context')}
				/>
				<Separator className='mx-4' />
				<ListItem icon='cpu' title={t('ai')} context={t('ai_context')} />
			</ListGroup>

			<View className='flex-1 flex justify-end'>
				<Button variant='danger-soft' onPress={handleSignout}>
					{t('signout')}
				</Button>
			</View>

			<BottomModal open={open} setOpen={setOpen}>
				<Appearance />
			</BottomModal>
		</View>
	)
}
