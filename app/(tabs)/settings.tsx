import { Appearance } from '@/components/appearance'
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol'
import { useIsRTL, useRTL } from '@/hooks/use-rtl'
import { raise } from '@/lib/utils'
import { signout } from '@/services/auth'
import { router } from 'expo-router'
import {
	BottomSheet,
	Button,
	Description, ListGroup,
	PressableFeedback, Separator, useThemeColor,
	useToast
} from 'heroui-native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

// Faq accordittion
// Chat avatart
// Other settings checkbox
// Controlfield
// Menu
// Radio
// Scroll shadow chat

// Surface chat
// Switch

// TODO:
// - Generate memory from chat history to improve response quality
// - decrease conversation by deleting unused topics in tthe same chat session
// - help

const ListItem = ({
	icon,
	title,
	context,
	onPress,
}: {
	icon: IconSymbolName
	title: string
	context: string
	onPress?: () => void
}) => {
	const foreground = useThemeColor('foreground')
	const isRtl = useIsRTL()
	const rtl = useRTL()
	return (
		<PressableFeedback animation={false} onPress={onPress}>
			<PressableFeedback.Scale>
				<ListGroup.Item style={{ direction: isRtl }}>
					<ListGroup.ItemPrefix>
						<IconSymbol name={icon} size={22} color={foreground} />
					</ListGroup.ItemPrefix>
					<ListGroup.ItemContent className={rtl('flex items-start')}>
						<ListGroup.ItemTitle>{title}</ListGroup.ItemTitle>
						<ListGroup.ItemDescription className={rtl('text-left')}>{context}</ListGroup.ItemDescription>
					</ListGroup.ItemContent>
					<ListGroup.ItemSuffix style={{ transform: rtl('rotate(180deg)') }}  />
				</ListGroup.Item>
			</PressableFeedback.Scale>
			<PressableFeedback.Ripple />
		</PressableFeedback>
	)
}

const BottomModal = ({
	children,
	open,
	setOpen,
}: {
	children: React.ReactNode
	open: boolean
	setOpen: (open: boolean) => void
}) => (
	<BottomSheet isOpen={open} onOpenChange={setOpen}>
		<BottomSheet.Portal>
			<BottomSheet.Overlay />
			<BottomSheet.Content>{children}</BottomSheet.Content>
		</BottomSheet.Portal>
	</BottomSheet>
)

// eslint-disable-next-line max-lines-per-function
export default function Tab() {
	const { t } = useTranslation()
	const { toast } = useToast()
	const [open, setOpen] = useState(false)
	const rtl = useRTL()

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

	return (
		<View className='flex justify-between h-full p-5'>
			<View className={`flex-1 py-10 items-center ${rtl('items-end')}`}>
				<Text className='text-4xl text-foreground'>{t('preferences')}</Text>
				<Description>{t('manage_preferences')}</Description>
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
