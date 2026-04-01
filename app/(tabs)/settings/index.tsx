import { Appearance } from '@/components/appearance'
import { BottomModal } from '@/components/bottom-modal'
import { ListItem } from '@/components/list-item'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { useRTL } from '@/hooks/use-rtl'
import { supabase } from '@/lib/supabase'
import { isValidName, raise } from '@/lib/utils'
import { signout } from '@/services/auth'
import { router } from 'expo-router'
import {
	Avatar,
	BottomSheet,
	Button,
	Description,
	FieldError,
	InputGroup,
	Label,
	ListGroup,
	PressableFeedback,
	Separator,
	TextField,
	useThemeColor,
	useToast
} from 'heroui-native'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, Text, type TextInput, View } from 'react-native'
import { useUniwind } from 'uniwind'

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

// eslint-disable-next-line max-lines-per-function, max-statements
export default function Tab() {
	const { t } = useTranslation()
	const { toast } = useToast()
	const rtl = useRTL()
	const { theme } = useUniwind()
	const muted = useThemeColor('muted')
	const inputRef = useRef<TextInput>(null)
	
	const [name, setName] = useState('')
	const [newName, setNewName] = useState('')

	const [appearanceOpen, setAppearanceOpen] = useState(false)
	const [profileOpen, setProfileOpen] = useState(false)

	const [focused, setFocused] = useState(false)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		supabase.auth.getUser().then(({ error, data }) => {
			if (error) {
				toast.show(error.message)
				return
			}
			setName(data.user.user_metadata.display_name)
		}).catch(raise)
	}, [])

	if (name.trim() === '') return null
	
	const avatarFromName = () => {
		const words = name.toUpperCase().trim().split(/\s+/u)
		if (words.length === 1) return words[0][0]
		return `${words[0][0]} ${words[1][0]}`
	}

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

	const handleUpdate = () => {
		setLoading(true)
		supabase
		.auth
		.updateUser({ data: { display_name: newName } })
		.then(({ error, data }) => {
			if (error) {
				toast.show(error.message)
				setLoading(false)
				return
			}
			setLoading(false)
			setProfileOpen(false)
			setName(newName)
			toast.show(t('name_updated'))
		})
		.catch(raise)
	}

	!profileOpen && Keyboard.dismiss()

	return (
		<View className='flex justify-between h-full p-5'>
			<PressableFeedback className='flex-1 py-10' onPress={() => { setProfileOpen(true) }}>
				<View className={`flex-row${rtl('-reverse')} justify-between`}>
					<View className={rtl('flex items-end')}>
						<Text className='text-4xl text-foreground'>{t('preferences')}</Text>
						<Description>{t('manage_preferences')}</Description>
					</View>
					<View>
						<Avatar color={theme === 'dark' ? 'accent' : 'default'} alt='account-avatar'>
						<Avatar.Fallback
							textProps={{ style: { fontSize: 24, lineHeight: 32 } }}
							styles={{ container: { justifyContent: 'center', alignItems: 'center', paddingBottom: 0, marginBottom: 0 } }}
						>{avatarFromName()}</Avatar.Fallback>
						</Avatar>
					</View>
				</View>
			</PressableFeedback>

			<ListGroup className='p-0'>
				<ListItem
					prefix='person'
					suffix='chevron.right'
					title={t('account')}
					context={t('account_context')}
					onPress={() => { router.push('/settings/account') }}
				/>
				<Separator className='mx-4' />
				<ListItem
					onPress={() => {
						setAppearanceOpen(true)
					}}
					prefix='pencil'
					title={t('appearance')}
					context={t('appearance_context')}
				/>
				<Separator className='mx-4' />
				<ListItem prefix='cpu' title={t('ai')} context={t('ai_context')} />
			</ListGroup>

			<View className='flex-1 flex justify-end'>
				<Button variant='danger-soft' onPress={handleSignout}>
					{t('signout')}
				</Button>
			</View>

			<BottomModal open={appearanceOpen} setOpen={setAppearanceOpen}>
				<Appearance />
			</BottomModal>

			<BottomModal open={profileOpen} setOpen={setProfileOpen}>
				<View className='gap-10 mb-10'>
					<BottomSheet.Title>{t('update_name')}</BottomSheet.Title>
					<TextField isRequired isInvalid={newName.length > 0 && !isValidName(newName)}>
						<Label>{t('display_name')}</Label>
						<InputGroup>
							<InputGroup.Input
								className='bg-border'
								placeholder={t('fake_name')}
								onFocus={() => { setFocused(true) }}
								onBlur={() => { setFocused(false) }}
								value={newName}
								onChangeText={setNewName}
								ref={inputRef}
							/>
							<InputGroup.Suffix>
								<PressableFeedback onPress={() => { inputRef.current?.focus() }}>
									<IconSymbol name='square.and.pencil' color={muted} size={16} />
								</PressableFeedback>
							</InputGroup.Suffix>
						</InputGroup>
						<FieldError>{t("name_error")}</FieldError>
					</TextField>
					<Button isDisabled={newName.length === 0 || !isValidName(newName) || loading} onPress={handleUpdate}>{t('update')}</Button>
					{focused && <View className='h-screen'></View>}
				</View>
			</BottomModal>
		</View>
	)
}
